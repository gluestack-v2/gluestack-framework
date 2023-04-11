import path from "path";
import fs from "fs";
import writeFile from "./write-file";
import writeSDKFunction from "./write-sdk-function";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import sdkIndexTemplateFunc from "./sdk-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
}
const writeSDK = (installationPath: string) => {
  const sdkIndexTemplate = sdkIndexTemplateFunc();
  const functionsPath = path.join(installationPath, "functions");
  const sdkPath = path.join(installationPath, ".");
  const sdkSrcIndex = path.join(sdkPath, "index.ts");
  const files = fs.readdirSync(functionsPath);

  let sdkFunctions = ``;

  files.forEach((functionFile: string, _index: number) => {
    const filePath = path.join(functionsPath, functionFile);
    if (!["ts", "tsx", "js", "jsx"].includes(filePathExtension(filePath))) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);
    const functionCodeString = fs.readFileSync(filePath, "utf8");

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);
    if (matches && matches[1]) {
      let params = matches[1].split(/\s*,\s*/);
      let sdkFunction = writeSDKFunction(functionName, params);
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
