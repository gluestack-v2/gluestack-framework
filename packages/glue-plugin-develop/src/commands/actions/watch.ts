
import { join } from "path";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import {
  info,
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";

export default async (app: AppCLI): Promise<void> => {
  app.watch(
    process.cwd(), [
      '.glue/internals/plugin-instances.json',
    ], async (event: string, path: string) => {

      info("Restarting watcher since new changes found...");

      await watchInstances(app);
  });
};

const watchInstances = async (app: AppCLI): Promise<void> => {
  for await (const plugin of app.plugins) {
    for await (const instance of plugin.instances) {
      success("Found instance", instance.getName());

      if (!instance.watch || !instance.watch().length) {
        warning(
          `${instance.getName()}`,
          "contains no watch method or it exists but returns an empty array"
        );
        continue;
      }

      warning(instance.getName(), "running watch method...");

      instance.watch();
    }
  }
};
