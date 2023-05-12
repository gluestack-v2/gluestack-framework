import path from "path";
import minioTemplate from "./minioTemplate";
import fs from "fs";
import dotenv from "dotenv";
import writeFile from "./write-file";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";

export const writeMinioStorageService = (
  generatedServiceGatewayPath: any,
  instanceName: any,
  storageInstance: IInstance
) => {
  console.log(
    generatedServiceGatewayPath,
    instanceName,
    "In gateway",
    storageInstance.getName(),
    storageInstance._sourcePath
  );
  const envPath = path.join(storageInstance._sourcePath, ".env");
  dotenv.config({
    path: envPath,
  });

  const envData = {
    endPoint: process.env.MINIO_CDN_END_POINT,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_USE_SSL,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    // region: this.settings.region,
    // transport: this.settings.transport,
    // sessionToken: this.settings.sessionToken,
  };
  const moleculerStorageServiceTemplate = minioTemplate(
    JSON.stringify(envData)
  );

  const moleculerStorageClientServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    "services",
    `${instanceName}.service.js`
  );
  writeFile(
    moleculerStorageClientServiceTemplatePath,
    moleculerStorageServiceTemplate
  );
};
