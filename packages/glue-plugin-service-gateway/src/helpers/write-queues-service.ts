import path from "path";
import fs from "fs";

import writeFile from "./write-file";
import replaceHandlerNames from "./replace-handler-names";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import moleculerQueuesServiceTemplateFunc from "./queues-service-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
}

function camelCaseArray(arr: any) {
  // Join array elements with a space
  const joinedString = arr.join(" ");

  // Split joinedString by space and capitalize each word except the first
  const words = joinedString.split(" ");
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Concatenate capitalized words
  const camelCaseString = words.join("");

  return camelCaseString;
}

function getNestedFilePaths(dirPath: any, fileList: any = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If the file is a directory, recursively call the function
      // to get nested file paths
      getNestedFilePaths(filePath, fileList);
    } else {
      // If the file is a regular file, add its path to the fileList
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Usage: Pass the directory path as an argument to the function

const writeQueuesService = (
  installationPath: string,
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerQueuesServiceTemplate =
    moleculerQueuesServiceTemplateFunc(instanceName);

  // const queuesPath = path.join(process.cwd(), installationPath);
  // console.log(installationPath);
  const queuesPath = path.join(generatedServiceGatewayPath, instanceName);

  const moleculerQueuesServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    "services",
    `${instanceName}.service.js`
  );

  // console.log(moleculerQueuesServiceTemplate);
  console.log(queuesPath, moleculerQueuesServiceTemplatePath);
  const files = getNestedFilePaths(queuesPath);

  let sdkFunctions = ``;
  let moleculerActions = ``;
  let moleculerChannels: any = {};
  let moleculerImportStatements = ``;

  files.forEach((queueFile: string, _index: number) => {
    const filePath = queueFile;
    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);

    if (fs.existsSync(filePath)) {
      let functionPath = ("./" + filePath).replace(
        generatedServiceGatewayPath,
        ""
      );
      functionPath = functionPath.split(".").slice(0, -1).join(".");

      // Create actions object
      let actionHandlerString = `${functionName}: {
        handler: async function (ctx) {
          this.broker.sendToChannel("${functionName}", ctx);
        },
      },`;

      const funcPath = functionPath.split("/");
      funcPath.splice(0, 2);

      let channel: any = {};
      channel.handler = camelCaseArray(funcPath) + "Handler";

      moleculerChannels[functionName] = channel;
      moleculerActions += actionHandlerString;

      // Create Import Statement
      let functionImportStatement = `const ${camelCaseArray(
        funcPath
      )}Handler = require("..${functionPath}");`;
      moleculerImportStatements += functionImportStatement + "\n";
    }
  });

  let finalString = moleculerQueuesServiceTemplate.replace(
    "// ***---Add Actions Here---***",
    `{${moleculerActions}}`
  );

  finalString = finalString.replace(
    "// ***---Add Imports Here---***",
    moleculerImportStatements
  );

  finalString = finalString.replace(
    "// ***---Add Channels Here---***",
    replaceHandlerNames(JSON.stringify(moleculerChannels, null, 2))
  );

  // Create functions service with all the actions and imports
  writeFile(moleculerQueuesServiceTemplatePath, finalString);
};

export default writeQueuesService;
