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
  let privateMoleculerActions: any = {};
  const files = getNestedFilePaths(functionsPath);

  let sdkFunctions = ``;
  let moleculerActions: any = {};
  let moleculerImportStatements = ``;
  let privateMoleculerImportStatements = ``;

  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;

    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }
    const isPrivate = filePath.includes("private");
    if (filePath.includes("private")) {
      privateMoleculerActions = {
        ...privateMoleculerActions,
        ...writePrivateService(installationPath, instanceName, filePath)
          .actions,
      };
      privateMoleculerImportStatements =
        privateMoleculerImportStatements +
        writePrivateService(installationPath, instanceName, filePath)
          .importPaths;
      return;
    }

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
  writeFiles(
    moleculerActions,
    moleculerFunctionsServiceTemplate,
    moleculerImportStatements,
    moleculerFunctionsServicePath
  );
  writeFiles(
    privateMoleculerActions,
    moleculerFunctionsServiceTemplateFunc("private"),
    privateMoleculerImportStatements,
    path.join(installationPath, "services", `private.service.js`)
  );
  updateApiGateway(installationPath, instanceName);
};

function updateApiGateway(installationPath: string, instanceName: string) {
  const apiGatewayPath = path.join(
    installationPath,
    "services",
    "api.service.js"
  );
  const whitelistedArr = [`${instanceName}.**`];
  const data = fs.readFileSync(apiGatewayPath, {
    encoding: "utf-8",
  });
  let writeData = ``;
  let whitelist: any = {};
  if (data.includes("// ***Update Whitlisted services here***")) {
    writeData = data.replace(
      "// ***Update Whitlisted services here***",
      `whitelist: ${JSON.stringify(whitelistedArr)},`
    );
    fs.writeFileSync(apiGatewayPath, writeData);
  } else {
    const regex = /whitelist(.*)\n/gm;
    const matches: any = data.match(regex);

    eval(`whitelist = {${matches[0]}}`);
    let whitelistArray = whitelist.whitelist;
    if (!whitelistArray.includes(`${instanceName}.**`)) {
      whitelistArray = [...whitelistArray, ...whitelistedArr];
      writeData = data.replace(matches[0], JSON.stringify(whitelistArray));
      fs.writeFileSync(apiGatewayPath, writeData);
    }
  }
}

const writePrivateService = (
  installationPath: string,
  instanceName: string,
  filePath: string
) => {
  const privateServicePath = path.join(
    installationPath,
    "services",
    `private.service.js`
  );
  let obj: any = {};
  let moleculerImportStatements = ``;
  const moleculerFunctionsServiceTemplate =
    moleculerFunctionsServiceTemplateFunc("private");

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

    let funcPath = functionPath.split("/");
    funcPath.splice(0, 2);
    funcPath = funcPath.filter((str) => str !== "private");
    action.handler = camelCaseArray(funcPath) + "Handler";

    obj[funcPath.join(".")] = action;

    // Create Import Statement
    let functionImportStatement = `const ${camelCaseArray(
      funcPath
    )}Handler = require("..${functionPath}");`;
    moleculerImportStatements += functionImportStatement + "\n";
  }
  return { actions: obj, importPaths: moleculerImportStatements };
  // writeFiles(
  //   moleculerActions,
  //   moleculerFunctionsServiceTemplate,
  //   moleculerImportStatements,
  //   privateServicePath
  // );
};

function writeFiles(
  moleculerActions: any,
  moleculerFunctionsServiceTemplate: any,
  moleculerImportStatements: any,
  path: string
) {
  let finalString = moleculerFunctionsServiceTemplate.replace(
    "// **---Add Actions Here---**",
    replaceHandlerNames(JSON.stringify(moleculerActions, null, 2))
  );

  finalString = finalString.replace(
    "// **---Add Imports Here---**",
    moleculerImportStatements
  );
  writeFile(path, finalString);
}

export default writeService;
