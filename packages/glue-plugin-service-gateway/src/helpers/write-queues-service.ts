import path from 'path';

import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import moleculerQueuesServiceTemplateFunc from './queues-service-template';

// Usage: Pass the directory path as an argument to the function

const writeQueuesService = (
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerQueuesServiceTemplate =
    moleculerQueuesServiceTemplateFunc(instanceName);

  const moleculerQueuesServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    'services',
    `${instanceName}.service.js`
  );

  writeFile(moleculerQueuesServiceTemplatePath, moleculerQueuesServiceTemplate);
};

export default writeQueuesService;
