import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/add";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("cron:add")
    .description("Adds a new cron job")
    .action((pluginName: string) => action(app, pluginName));
};
