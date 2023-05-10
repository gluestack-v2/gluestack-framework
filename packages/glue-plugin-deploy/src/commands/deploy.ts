import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/deploy';

export default async (program: any) => {
  const command: ICommand = program
    .command('deploy')
    .option(
      '-a, --auth [true]',
      'Re-enter credentials, do not use presisted credentials from earlier',
      false
    )
    .description('Prepares the compressed project & initiates the deployment')
    .action((options: any) => action(options));
};
