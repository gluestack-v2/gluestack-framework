import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/generate";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("dbclient:generate")
    .description("Runs prisma generate")
    .action((opts: any) => action(app, opts));
};
