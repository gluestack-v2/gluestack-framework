import { AppCLI } from '@gluestack-v2/framework-cli';
import type { ICommand } from '@gluestack-v2/framework-cli';

import action from './actions/generate';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('dbclient:generate')
    .description('Runs prisma generate')
    .action((opts: any) => action(app, opts));
};
