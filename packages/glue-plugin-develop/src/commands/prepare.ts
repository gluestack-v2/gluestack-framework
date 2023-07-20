import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/prepare';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('prepare')
    .argument('[packageName]', 'Plugin name', '')
    .description('Prepare all services to run in docker')
    .action((packageName: string) => action(app, packageName));
};
