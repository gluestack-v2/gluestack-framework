/**
 * Watches the instances for changes and restarts them
 */

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/watch';

export default async (program: ICommand, app: AppCLI) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('watch')
    .argument('[pluginName]', 'Plugin name', '')
    .description('Watches the instances for changes and restarts them')
    .action(() => action(app));
};
