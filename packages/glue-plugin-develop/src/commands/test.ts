import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/test";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("test")
    .description("Test plugins")
    .action(() => action(app));
};
