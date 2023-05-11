import path from "path";
import writeFile from "./write-file";
import moleculerCronServiceTemplateFunc from "./cron-service-template-js-support";

// Usage: Pass the directory path as an argument to the function

const writeCronService = async (
  installationPath: string,
  generatedServiceGatewayPath: string,
  instanceName: string
) => {
  const moleculerCronServiceTemplate =
    moleculerCronServiceTemplateFunc(instanceName);
  const moleculerCronServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    "services",
    `${instanceName}.service.js`
  );

  // Create functions service with all the actions and imports

  writeFile(moleculerCronServiceTemplatePath, moleculerCronServiceTemplate);
};
export default writeCronService;
