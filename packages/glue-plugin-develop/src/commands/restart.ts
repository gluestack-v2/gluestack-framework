import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/restart';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command('restart')
    .description('Restarts all the plugins to the docker')
    .action((opts: any) => action(app, opts));
};
