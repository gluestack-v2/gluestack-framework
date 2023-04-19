import path from "path";
import fs from "fs";
import writeFile from "./write-file";
import writeSDKFunction from "./write-sdk-function";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import sdkIndexTemplateFunc from "./sdk-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
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

const writeSDK = (installationPath: string) => {
  const sdkIndexTemplate = sdkIndexTemplateFunc();
  const functionsPath = path.join(installationPath, "functions");
  const sdkPath = path.join(installationPath, ".");
  const sdkSrcIndex = path.join(sdkPath, "index.ts");
  // const files = fs.readdirSync(functionsPath);
  const files = getNestedFilePaths(functionsPath);
  let sdkFunctions = ``;

  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;
    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);
    const functionPath = filePath.replace(installationPath, "");

    const functionCodeString = fs.readFileSync(filePath, "utf8");

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);
    if (matches && matches[1]) {
      let params = matches[1].split(/\s*,\s*/);
      let sdkFunction = writeSDKFunction(functionName, params, functionPath);
      // console.log(sdkFunctions);
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
      sdkFunctions
    )
  );
};
export default writeSDK;
