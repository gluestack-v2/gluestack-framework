import path from "path";
import fs from "fs";

// const sdkIndexTemplate = require("./templates/sdkIndexTemplate")();

import writeFile from "./write-file";
import getPathAfterString from "./get-path-after-string";
import writeSDKFunction from "./write-sdk-function";
import replaceHandlerNames from "./replace-handler-names";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import moleculerFunctionsServiceTemplateFunc from "./functions-service-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
}
const writeService = (installationPath: string) => {
  const moleculerFunctionsServiceTemplate =
    moleculerFunctionsServiceTemplateFunc();
  const functionsPath = path.join(installationPath, "functions");
  const moleculerFunctionsPath = path.join(installationPath, "functions");
  const moleculerFunctionsServicePath = path.join(
    installationPath,
    "services",
    "functions.service.js"
  );

  // const sdkPath = path.join(__dirname, "..", "packages", "sdk");
  // const sdkSrcIndex = path.join(sdkPath, "src", "index.ts");

  // const watcher = chokidar.watch(`${functionsPath}/**/*`, {
  //   ignored: /^\./, // ignore dotfiles
  //   persistent: true, // keep watching even if there are no changes
  //   awaitWriteFinish: true,
  // });

  // watcher.on("all", (event, file) => {
  //   console.log(`${event} detected on ${file}`);

  // if (event === "change") {
  // console.log(`Found change in ${file}`);

  const files = fs.readdirSync(functionsPath);

  let sdkFunctions = ``;
  let moleculerActions: any = {};
  let moleculerImportStatements = ``;

  files.forEach((functionFile: string, _index: number) => {
    const filePath = path.join(functionsPath, functionFile);
    if (!["ts", "tsx", "js", "jsx"].includes(filePathExtension(filePath))) {
      return;
    }
    const functionName = getFileNameWithoutExtension(filePath);
    const functionCodeString = fs.readFileSync(filePath, "utf8");

    // const filePathFromFunctions = getPathAfterString(filePath, "functions/");
    // const moleculerFunctionPath = path.join(
    //   __dirname,
    //   moleculerFunctionsPath,
    //   filePathFromFunctions
    // );

    // writeFile(moleculerFunctionPath, functionCodeString);
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

    // Create actions object
    let action: any = {};
    action.rest = {
      method: "POST",
      path: "/" + functionName,
    };
    action.handler = functionName + "Handler";

    moleculerActions[functionName] = action;

    // Create Import Statement
    let functionImportStatement = `const ${functionName}Handler = require("../functions/${functionName}");`;
    moleculerImportStatements += functionImportStatement + "\n";
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

  // Create SDK index file with all the functions
  // createFileWithPath(
  //   sdkSrcIndex,
  //   sdkIndexTemplate.replace(
  //     "// **---Functions will be added after this---**",
  //     sdkFunctions
  //   )
  // );
  // }
};
export default writeService;
