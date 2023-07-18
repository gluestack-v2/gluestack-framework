import path from 'path';

import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import readfile from '@gluestack-v2/framework-cli/build/helpers/file/read-file';
import moleculerCronServiceTemplateFunc from './cron-service-template';
import moleculerCronServiceActionTemplateFunc from './cron-service-action-template';
import moleculerCronWebhookServiceTemplateFunc from './cron-service-webhook-template';
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

const writeCronService = async (
  installationPath: string,
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerCronServiceTemplate = moleculerCronServiceTemplateFunc();
  const moleculerCronWebhookServiceTemplate =
    moleculerCronWebhookServiceTemplateFunc.http();
  const moleculerCronInternalServiceTemplate =
    moleculerCronWebhookServiceTemplateFunc.internal();
  const cronPath = installationPath;
  // const moleculerFunctionsPath = path.join(installationPath, "functions");
  const moleculerCronServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    'services',
    `${instanceName}.service.js`
  );
  // console.log("> Writing cron service", moleculerCronServiceTemplatePath);

  let crons: any = await readfile(path.join(cronPath, 'index.json'));
  crons = JSON.parse(crons);

  let cronsObj = '';
  let actionsObj = '';
  crons.forEach((cron: any, _index: number) => {
    let { name, schedule, path, ...restProps } = cron;
    let method = 'post';
    if (restProps.method) {
      method = restProps.method;
    }
    let data = {};
    if (restProps.data) {
      data = restProps.data;
    }
    let cronObj = '';

    if (path.startsWith('http')) {
      cronObj = moleculerCronWebhookServiceTemplate
        .replace('// **--- Cron Name ---**', `"${name}"`)
        .replace('// **--- Cron Name ---**', `${name}`)
        .replace('// **--- Cron Schedule ---**', `"${schedule}"`)
        .replace('// **--- Webhook Method ---**', `"${method}"`)
        .replace('// **--- Webhook URL ---**', `"${path}"`)
        .replace('// **--- Webhook Data ---**', JSON.stringify(data));
      cronsObj += cronObj;
    } else {
      let internalServiceMethodName = getCamelCaseName(path) + 'Action';
      let actionTemplate = moleculerCronServiceActionTemplateFunc();
      // clean up the path
      if (path.split('/')[0] === '') {
        let nameArr = path.split('/');
        nameArr.splice(0, 1);
        path = nameArr.join('/');
      }
      let serviceName = path.split('/').join('.');
      cronObj = moleculerCronInternalServiceTemplate
        .replace('// **--- Cron Name ---**', `"${name}"`)
        .replace('// **--- Cron Name ---**', `${name}`)
        .replace('// **--- Cron Schedule ---**', `"${schedule}"`)
        .replace(
          '**--- Action CallMethod ---**',
          `${internalServiceMethodName}`
        )
        .replace('**--- Cron Data ---**', `${JSON.stringify(data)}`);

      let actionObj = actionTemplate
        .replace(
          '**--- Action CallMethod ---**',
          `${internalServiceMethodName}`
        )
        .replace('**--- Action Data ---**', `${JSON.stringify(data)}`)
        .replace('**--- Service Method ---**', `${serviceName}`);

      cronsObj += cronObj;
      actionsObj += actionObj;
    }
  });

  let finalString = moleculerCronServiceTemplate.replace(
    '// **---Add Cron Jobs Here---**',
    cronsObj
  );

  finalString = finalString.replace(
    '// **---Add Cron Actions Here---**',
    actionsObj
  );

  // Create functions service with all the actions and imports

  writeFile(moleculerCronServiceTemplatePath, finalString);

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
export default writeCronService;
