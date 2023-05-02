import path from "path";
import fs from "fs";
import writeFile from "./write-file";
import writeSDKFunction from "./write-sdk-function";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import sdkIndexTemplateFunc from "./sdk-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
}
let functionsMap: any = {};

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

const createFunctionFromPath = (path: string, value: any, sdkFunction: any) => {
  const pathArr = path.split("/");
  // console.log(sdkFunction);
  let obj = {};
  let current: any = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (pathArr[i] !== "") {
      // if (i == pathArr.length - 1) {
      //   console.log(i, "in if");
      //   current[pathArr[i]] = sdkFunction;
      // } else {

      current[pathArr[i]] = {};
      // }
      current = current[pathArr[i]];
    }
  }
  current[pathArr[pathArr.length - 1]] =
    "****" + pathArr[pathArr.length - 1] + "****";
  functionsMap["****" + pathArr[pathArr.length - 1] + "****"] = sdkFunction;

  return obj;
};

const deepMerge = (obj1: any, obj2: any) => {
  let output = { ...obj1 };
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === "object" &&
        obj1.hasOwnProperty(key) &&
        typeof obj1[key] === "object"
      ) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }
  return output;
};

const writeSDK = (sourcePath: string, installationPath: string) => {
  let obj = {};
  const sdkIndexTemplate = sdkIndexTemplateFunc();
  const functionsPath = sourcePath;
  const sdkPath = installationPath;
  const sdkSrcIndex = path.join(sdkPath, "index.ts");

  const files = getNestedFilePaths(functionsPath);


  let sdkFunctions = ``;
  let finalString = ``;
  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;
    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);

    let functionPath = filePath.replace(sourcePath, "");
    functionPath = functionPath.split(".").slice(0, -1).join(".");

    const functionCodeString = fs.readFileSync(filePath, "utf8");

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);

    if (matches && matches[1]) {
      let params = matches[1].split(/\s*,\s*/);
      let sdkFunction = writeSDKFunction(functionName, params, functionPath);
      obj = {
        ...obj,
        ...deepMerge(
          obj,
          createFunctionFromPath(functionPath, {}, sdkFunction)
        ),
      };

      finalString = JSON.stringify(obj).replace(":", "=");
      finalString = finalString.substring(1, finalString.length - 1);

      // console.log(
      //   functionName,
      //   JSON.stringify(obj),
      //   "****" + functionName + "****",
      //   functionsMap,
      //   obj,
      //   "\n"
      // );
      Object.keys(functionsMap).map((key: any) => {
        finalString = finalString.replace(`"${key}"`, functionsMap[key]);
      });

      sdkFunctions += sdkFunction + "\n";
    } else {
      console.log(
        "NO MATCHES FOR PARMAS IN THE PROVIDED FUNCTION " + functionName
      );
    }
  });

  // Create SDK index file with all the functions

  writeFile(
    sdkSrcIndex,
    sdkIndexTemplate.replace(
      "// **---Functions will be added after this---**",
      finalString
    )
  );
};
export default writeSDK;
