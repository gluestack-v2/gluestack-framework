import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/add";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("cron:add")
    .description("Runs build API for all the plugins")
    .action((pluginName: string) => action(app, pluginName));
};
