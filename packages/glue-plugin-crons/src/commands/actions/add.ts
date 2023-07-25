import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import prompts from 'prompts';

export default async (app: AppCLI, _pluginName: string = ''): Promise<void> => {
  const questions: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'Cron Job Name',
      message: 'Enter Cron Job Name',
      validate: (value: string) => value !== '',
    },
    {
      name: 'Cron Job Schedule',
      type: 'text',
      message: `Enter Cron Job Schedule (e.g. * * * * *)`,
    },
    {
      name: 'Cron Job Path',
      type: 'text',
      message: `Enter Cron Job Path (e.g. /functions/add or https://api.github.com/users)`,
    },
  ];

  // Prompt the user for input values
  const answers = await prompts(questions);
  await app
    .getPluginByName('@gluestack-v2/glue-plugin-crons')
    // @ts-ignore
    ?.addCronJob(answers);
};
