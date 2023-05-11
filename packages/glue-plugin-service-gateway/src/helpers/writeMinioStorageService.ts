import path from "path";
import minioTemplate from "./minioTemplate";
import fs from "fs";

export const writeMinioStorageService = (
  generatedServiceGatewayPath: any,
  instanceName: any
) => {
  // const envData = {
  //   endPoint: this.settings.endPoint,
  //   port: this.settings.port,
  //   useSSL: this.settings.useSSL,
  //   accessKey: this.settings.accessKey,
  //   secretKey: this.settings.secretKey,
  //   // region: this.settings.region,
  //   // transport: this.settings.transport,
  //   // sessionToken: this.settings.sessionToken,
  // };
  const moleculerQueuesServiceTemplate = minioTemplate(instanceName);

  const moleculerQueuesServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    "services",
    `${instanceName}.service.js`
  );
};
