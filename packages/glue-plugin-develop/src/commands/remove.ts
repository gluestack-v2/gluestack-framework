import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import { Argument } from 'commander';
import action from './actions/remove';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command('remove')
    .description('Removes the given instance.')
    .addArgument(
      new Argument('<instance-name>', 'name of the instance to be removed')
    )
    .action((instanceName: any) => action(app, instanceName));
};
