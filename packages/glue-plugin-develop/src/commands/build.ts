import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/build';
import { GlueStackPlugin } from '..';

export default async (program: any, plugin: GlueStackPlugin): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('build')
    .argument('[pluginName]', 'Plugin name', '')
    .description('Runs build API for all the plugins')
    .action((pluginName: string) => action(plugin, pluginName));
};
