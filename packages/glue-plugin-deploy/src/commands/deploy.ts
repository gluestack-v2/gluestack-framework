import deploy from '@gluestack-seal/cli/build/actions/deploy';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import { SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/seal';

export default async (program: any) => {
  const command: ICommand = program
    .command('deploy')
    .option(
      '-a, --auth [true]',
      'Re-enter credentials, do not use presisted credentials from earlier',
      false
    )
    .description('Prepares the compressed project & initiates the deployment')
    .action((options: any) => {
      // process.chdir('./.glue/__generated__/seal/services');
      process.chdir(SEAL_SERVICES_PATH);
      deploy(options);
    });
};
