import path from "path";
import fs from "fs";
import writeFile from "./write-file";
// import replaceHandlerNames from "./replace-handler-names";
// import getFileNameWithoutExtension from "./get-file-name-without-ext";
import { eventsTemplate as moleculerFunctionsServiceTemplateFunc } from "./template";
import fileExists from "./file-exists";

let middlewareNames = [
  "logHelloLocalAction",
  "loggerLocalAction",
  "loggerRemoteAction",
];

let middlewareIndexTemplate = `
// Local actions imports

module.exports = {
  // Middleware Object Here
};

`;

function filePathExtension(filePath: string): string {
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

let removeExtention = (filePath: string) => {
  return filePath.split(".")[0];
};

// Remove last element from array
let removeLastElement = (arr: any) => {
  arr.splice(-1, 1);
  return arr;
};

// Check and push if element is not present in array
let checkAndPush = (arr: any, element: any) => {
  if (!arr.includes(element)) {
    arr.push(element);
  }
};

let generateMiddlewareName = (filePath: string) => {
  let middlewareName = "";
  filePath = removeLastElement(filePath.split("/")).join("/");
  filePath.split("/").forEach((val: string, ind: number) => {
    middlewareName += ind === 0 ? val : val[0].toUpperCase() + val.substring(1);
  });
  checkAndPush(middlewareNames, removeExtention(middlewareName) + "Middleware");
  return middlewareName;
};

let generateMiddlewareAction = (filePath: string) => {
  let middlewareName = "";
  let actionType = removeExtention(filePath.split("/").pop() ?? "");
  filePath.split("/").forEach((val: string, ind: number) => {
    middlewareName += ind === 0 ? val : val[0].toUpperCase() + val.substring(1);
  });
  return { type: actionType, name: removeExtention(middlewareName) };
};

let generateMiddlewareObject = (filePaths: string[]) => {
  let middleWareObj: any = {};
  let middleWareActionNameMap: any = {};
  let uniqueIndex = 0;
  filePaths.forEach(async (filePath: string) => {
    let middlewareName = generateMiddlewareName(
      filePath.split("/middlewares/")[1]
    );
    let { type: actionType, name: middlewareActionName } =
      generateMiddlewareAction(filePath.split("/middlewares/")[1]);
    let middleWareActionKey = "MiddleWareAction" + uniqueIndex++;
    if (!middleWareActionNameMap[middlewareActionName]) {
      middleWareActionNameMap[middleWareActionKey] = middlewareActionName;
    }
    if (middlewareName !== "") {
      if (!middleWareObj[middlewareName]) {
        middleWareObj[middlewareName] = {};
      }
      middleWareObj[middlewareName][actionType] = middleWareActionKey;
    }
  });
  let middleWareObjectString = JSON.stringify(middleWareObj, null, 2);

  Object.keys(middleWareActionNameMap).forEach((key) => {
    middleWareObjectString = middleWareObjectString.replace(
      `"${key}"`,
      middleWareActionNameMap[key]
    );
  });

  return middleWareObjectString;
  // // let middlewareNames: string[] = generateMiddlewareNames(filePaths);
  // // let middlewareActionNames: string[] =
  // //   generateMiddlewareActionNames(filePaths);

  // return { middlewareNames, middlewareActionNames };
};

const getMiddlewareServiceMetas = (filePaths: string[]) => {
  let middlewareImportStatements = "";
  let middlewareNamesString = "";
  // let middlewareActionNames = generateMiddlewareActionNames(filePaths);
  let middlewareObjectString = generateMiddlewareObject(filePaths);
  console.log(middlewareObjectString);

  // filePaths.forEach(async (filePath: string, index: number) => {
  //   let middlewareRootPath =
  //     filePath.split("/middlewares/")[0] + "/middlewares";

  //   let middleWareIndexFile = ``;
  //   if (await fileExists(middlewareRootPath + "/index.js")) {
  //     middleWareIndexFile = fs.readFileSync(
  //       middlewareRootPath + "/index.js",
  //       "utf8"
  //     );
  //   } else {
  //   }
  //   console.log("> Writing middleware service", middlewareRootPath);
  //   let finalString = "";

  //   // files.forEach((functionFile: string, _index: number) => {
  //   //   if (functionFile.includes("/middlewares/")) {
  //   //     console.log("> Ignoring middlewares folder", functionFile);
  //   //     writeMiddlewareService();
  //   //     return;
  //   //   } else {
  //   //     const filePath = functionFile;
  //   //     if (
  //   //       ["json"].includes(filePathExtension(filePath)) ||
  //   //       filePath.includes("node_modules")
  //   //     ) {
  //   //       return;
  //   //     }
  //   //     const functionName = getFileNameWithoutExtension(filePath);

  //   //     if (fs.existsSync(filePath)) {
  //   //       let functionPath = ("./" + filePath).replace(installationPath, "");
  //   //       functionPath = functionPath.split(".").slice(0, -1).join(".");

  //   //       const functionCodeString = fs.readFileSync(filePath, "utf8");
  //   //       const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
  //   //       const matches = functionCodeString.match(regex);

  //   //       // Create actions object
  //   //       let action: any = {};
  //   //       action.rest = {
  //   //         method: "POST",
  //   //         path: functionPath,
  //   //       };
  //   //       const funcPath = functionPath.split("/");
  //   //       funcPath.splice(0, 2);
  //   //       action.handler = camelCaseArray(funcPath) + "Handler";

  //   //       moleculerActions[funcPath.join(".")] = action;

  //   //       // Create Import Statement
  //   //       let functionImportStatement = `const ${camelCaseArray(
  //   //         funcPath
  //   //       )}Handler = require("..${functionPath}");`;
  //   //       moleculerImportStatements += functionImportStatement + "\n";
  //   //     }
  //   //   }
  //   // });

  //   // Create functions service with all the actions and imports
  //   // writeFile(moleculerFunctionsServicePath, finalString);
  // });
};
export default getMiddlewareServiceMetas;
