import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/list";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("cron:list")
    .description("List all the cron jobs")
    .action((opts: any) => action(app, opts));
};
