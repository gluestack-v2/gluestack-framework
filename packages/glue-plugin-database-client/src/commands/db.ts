import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/db';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('db <type>')
    .allowUnknownOption()
    .option('type --options <opts>')
    .description(
      'Prisma options. Please refer => https://www.prisma.io/docs/reference/api-reference/command-reference'
    )
    .action((type: string) => {
      return action(app, { type, opts: program.args });
    });
};
