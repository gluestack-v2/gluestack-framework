import { AppCLI, error, fileExists } from '@gluestack-v2/framework-cli';

export default async (app: AppCLI, _instanceName: any): Promise<void> => {
  let dbclientPlugin = app.getPluginByName(
    '@gluestack-v2/glue-plugin-database-client'
  );
  let dbclientInstance = dbclientPlugin?.getInstances()[0];
  if (!dbclientInstance) {
    error('No database client instance found');
    return;
  }

  let generatePath = `${dbclientInstance._destinationPath}`;

  if (!fileExists(generatePath)) {
    error('No database client instance found');
    return;
  }
  // @ts-ignore
  await dbclientInstance.generateDbClientService(generatePath);
};
