import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/generate';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('db:generate')
    .description('Runs prisma generate')
    .action(() => action(app));
};
