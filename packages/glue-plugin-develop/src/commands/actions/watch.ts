import chokidar from 'chokidar';
import { Workspaces } from "@gluestack/helpers";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import {
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";

import { FOLDER_STRUCTURE } from "../../constants/folder-structure";
import createFoldersFromJson from "../../helpers/create-folders-from-json";
import { GLUE_GENERATED_PACKAGES_PATH } from "../../constants/glue-generated-packages";
import { join } from 'path';

export default async (app: AppCLI, pluginName: string = ''): Promise<void> => {
  // creates folders from FOLDER_STRUCTURE constant
  await createFoldersFromJson(FOLDER_STRUCTURE, process.cwd());

  // add __generated__/packages into workspaces
  await Workspaces.append(
    `${process.cwd()}/package.json`,
    GLUE_GENERATED_PACKAGES_PATH
  );

  // await restart(app);
  await watchInstances(app, pluginName);
};


const watchInstances = async (app: AppCLI, pluginName: string = ''): Promise<void> => {
  for await (const plugin of app.plugins) {
    if (pluginName !== '' && plugin.getName() !== pluginName) {
      continue;
    }

    success("Found plugin", plugin.getName());

    if (!plugin.watch) {
      warning(
        `${plugin.getName()}`,
        "contains no watch method"
      );
      continue;
    }

    warning(plugin.getName(), "running watch method...");

    await plugin.watch();
  }
};
