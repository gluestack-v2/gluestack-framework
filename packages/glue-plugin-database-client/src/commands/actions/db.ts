import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error } from '@gluestack-v2/framework-cli/build/helpers/print';

export default async (app: AppCLI, argument: any): Promise<void> => {
  const dbclientPlugin = app.getPluginByName(
    '@gluestack-v2/glue-plugin-database-client'
  );
  const dbclientInstance = dbclientPlugin?.getInstances()[0];
  if (!dbclientInstance) {
    error('No database client instance found');
    return;
  }
  const generatePath = `${dbclientInstance._destinationPath}`;
  // @ts-ignore
  await dbclientInstance.dbCommandService(generatePath, argument);
};
