import { AppCLI, error } from '@gluestack-v2/framework-cli';

export default async (app: AppCLI, argument: any): Promise<void> => {
  let dbclientPlugin = app.getPluginByName(
    '@gluestack-v2/glue-plugin-database-client'
  );
  let dbclientInstance = dbclientPlugin?.getInstances()[0];
  if (!dbclientInstance) {
    error('No database client instance found');
    return;
  }
  let generatePath = `${dbclientInstance._destinationPath}`;
  // @ts-ignore
  await dbclientInstance.dbCommandService(generatePath, argument);
};
