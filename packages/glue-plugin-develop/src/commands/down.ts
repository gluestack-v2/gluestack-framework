import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";

import action from "./actions/down";

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
    .command("down")
    .description("Downs all the plugins to the docker")
    .action(() => action(app));
};
