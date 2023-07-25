import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
export default async (app: AppCLI, _instanceName: any): Promise<void> => {
  // @ts-ignore
  await app.getPluginByName('@gluestack-v2/glue-plugin-crons')?.listCronJobs();
};
