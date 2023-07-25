import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error } from '@gluestack-v2/framework-cli/build/helpers/print';

export default async (app: AppCLI, argument: any): Promise<void> => {
  if (argument) {
    // eslint-disable-next-line no-console
    console.log('Removing cron job...', argument);
    await app
      .getPluginByName('@gluestack-v2/glue-plugin-crons')
      // @ts-ignore
      ?.removeCronJob(argument);
  } else {
    error('You must provide a cron job name');
  }
};
