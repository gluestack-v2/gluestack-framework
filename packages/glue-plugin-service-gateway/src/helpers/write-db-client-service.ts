import path from 'path';
import fs from 'fs';

// const sdkIndexTemplate = require("./templates/sdkIndexTemplate")();

import writeFile from './write-file';
import { readfile } from './readfile';
// import getPathAfterString from "./get-path-after-string";
// import writeSDKFunction from "./write-sdk-function";
// import replaceHandlerNames from "./replace-handler-names";
// import getFileNameWithoutExtension from "./get-file-name-without-ext";
import moleculerDbClientServiceTemplateFunc from './dbclient-service-template';
import { updateApiGateway } from './write-service';
// function filePathExtension(filePath: string) {
//   return filePath.split(".").pop() ?? "";
// }

function getCamelCaseName(name: string) {
  // clean up the name
  if (name.split('/')[0] === '') {
    let nameArr = name.split('/');
    nameArr.splice(0, 1);
    name = nameArr.join('/');
  }
  return name
    .split('/')
    .map(
      (word, ind) =>
        (ind !== 0 ? word[0]?.toUpperCase() : word[0]?.toLowerCase()) +
        word.slice(1)
    )
    .join('');
}

// Usage: Pass the directory path as an argument to the function

const writeDbClientService = async (
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerDbClientServiceTemplate =
    moleculerDbClientServiceTemplateFunc();

  // const moleculerFunctionsPath = path.join(installationPath, "functions");
  const moleculerDbClientServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    'services',
    `${instanceName}.service.js`
  );
  // console.log("> Writing cron service", moleculerDbClientServiceTemplatePath);

  // Create functions service with all the actions and imports

  writeFile(
    moleculerDbClientServiceTemplatePath,
    moleculerDbClientServiceTemplate
  );

  // Create SDK index file with all the functions
  // createFileWithPath(
  //   sdkSrcIndex,
  //   sdkIndexTemplate.replace(
  //     "// **---Functions will be added after this---**",
  //     sdkFunctions
  //   )
  // );
  // }
  updateApiGateway(generatedServiceGatewayPath, instanceName);
  updateApiGateway(generatedServiceGatewayPath, 'dbCLient1');
};
export default writeDbClientService;
