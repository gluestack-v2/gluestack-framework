import path from 'path';
import writeFile from './write-file';
import moleculerMailerServiceTemplateFunc from './mailer-template';

const writeMailerService = async (
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerMailerServiceTemplate = moleculerMailerServiceTemplateFunc();

  const moleculerDbClientServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    'services',
    `${instanceName}.service.js`
  );

  writeFile(
    moleculerDbClientServiceTemplatePath,
    moleculerMailerServiceTemplate
  );
};
export default writeMailerService;
