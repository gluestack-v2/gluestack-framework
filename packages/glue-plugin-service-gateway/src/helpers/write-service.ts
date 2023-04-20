import path from "path";
import fs from "fs";
import writeFile from "./write-file";
import replaceHandlerNames from "./replace-handler-names";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import moleculerFunctionsServiceTemplateFunc from "./functions-service-template";

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

const writeService = (installationPath: string, instanceName: string) => {
  const moleculerFunctionsServiceTemplate =
    moleculerFunctionsServiceTemplateFunc(instanceName);
  const functionsPath = path.join(installationPath, instanceName);
  const moleculerFunctionsServicePath = path.join(
    installationPath,
    "services",
    `${instanceName}.service.js`
  );
  const files = getNestedFilePaths(functionsPath);

  let sdkFunctions = ``;
  let moleculerActions: any = {};
  let moleculerImportStatements = ``;

  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;
    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);

    if (fs.existsSync(filePath)) {
      let functionPath = ("./" + filePath).replace(installationPath, "");
      functionPath = functionPath.split(".").slice(0, -1).join(".");

      const functionCodeString = fs.readFileSync(filePath, "utf8");
      const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
      const matches = functionCodeString.match(regex);

      // Create actions object
      let action: any = {};
      action.rest = {
        method: "POST",
        path: functionPath,
      };
      const funcPath = functionPath.split("/");
      funcPath.splice(0, 2);
      action.handler = camelCaseArray(funcPath) + "Handler";

      moleculerActions[funcPath.join(".")] = action;

      // Create Import Statement
      let functionImportStatement = `const ${camelCaseArray(
        funcPath
      )}Handler = require("..${functionPath}");`;
      moleculerImportStatements += functionImportStatement + "\n";
    }
  });

  let finalString = moleculerFunctionsServiceTemplate.replace(
    "// **---Add Actions Here---**",
    replaceHandlerNames(JSON.stringify(moleculerActions, null, 2))
  );

  finalString = finalString.replace(
    "// **---Add Imports Here---**",
    moleculerImportStatements
  );

  // Create functions service with all the actions and imports
  writeFile(moleculerFunctionsServicePath, finalString);
};
export default writeService;
