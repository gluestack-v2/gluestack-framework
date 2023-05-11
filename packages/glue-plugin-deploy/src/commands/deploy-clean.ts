import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/deploy-clean';

export default async (program: any): Promise<void> => {
  const command: ICommand = program
    .command('deploy-clean')
    .description('Removes login credentials')
    .action(() => action());
};
