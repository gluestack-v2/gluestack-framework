import path from 'path';
import minioTemplate from './minioTemplate';
import dotenv from 'dotenv';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { updateApiGateway } from './write-service';

export const writeMinioStorageService = async (
  generatedServiceGatewayPath: any,
  instanceName: any,
  storageInstance: IInstance
) => {
  const envPath = path.join(storageInstance._sourcePath, '.env');
  dotenv.config({
    path: envPath,
  });

  const envData = {
    endPoint: process.env.MINIO_CDN_END_POINT,
    port: Number(process.env?.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true' ? true : false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    // region: this.settings.region,
    // transport: this.settings.transport,
    // sessionToken: this.settings.sessionToken,
  };

  const moleculerStorageServiceTemplate = minioTemplate(
    JSON.stringify(envData),
    '`uploads/${file.originalFilename}`'
  );

  const moleculerStorageClientServiceTemplatePath = path.join(
    generatedServiceGatewayPath,
    'services',
    `${instanceName}.service.js`
  );
  await writeFile(
    moleculerStorageClientServiceTemplatePath,
    moleculerStorageServiceTemplate
  );
  await updateApiGateway(generatedServiceGatewayPath, 'storage');
};
