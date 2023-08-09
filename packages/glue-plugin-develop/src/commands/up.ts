import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import action from './actions/up';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('up')
    .option('-s <service-name>', 'Provide the name of the service', 'all')
    .option('-p <platform>', 'Choose Platform', 'local')
    .option('--verbose', 'Verbose', false)
    .description('Deploys all the plugins to the docker')
    .action((opts: any) => action(app, opts));
};
