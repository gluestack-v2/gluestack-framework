import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/start';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command('start')
    .description('start runs watch prepare and up')
    .action((opts: any) => action());
};
