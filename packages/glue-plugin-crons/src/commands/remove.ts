import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/remove';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('cron:remove')
    .arguments('[cronJobName]')
    .description('Remove a cron job')
    .action((opts: any) => action(app, opts));
};
