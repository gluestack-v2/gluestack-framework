import { AppCLI } from '@gluestack-v2/framework-cli';
import type { ICommand } from '@gluestack-v2/framework-cli';

import action from './actions/migrate';

export default async (program: any, app: AppCLI): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const command: ICommand = program
    .command('dbclient:migrate <type>')
    .allowUnknownOption()
    .option('type --options <opts>')
    .description(
      'Prisma Migrate options. Please refer => https://www.prisma.io/docs/concepts/components/prisma-migrate'
    )
    .action((type: string) => {
      return action(app, { type, opts: program.args });
    });
};
