import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/up";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("up")
    .option("-p <platform>", "Choose Platform")
    .description("Deploys all the plugins to the docker")
    .action((opts: any) => action(app, opts));
};
