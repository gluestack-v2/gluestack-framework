import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/down';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('down')
    .option('-s <service-name>', 'Provide the name of the service', 'all')
    .description('Downs all the plugins to the docker')
    .action((opts: any) => action(app, opts));
};
