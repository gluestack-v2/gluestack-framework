/* eslint-disable @typescript-eslint/no-unused-vars */
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/stop';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command('stop')
    .description('stop all the services')
    .action((opts: any) => action());
};
