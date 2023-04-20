
import { join } from "path";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import {
  info,
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";

export default async (app: AppCLI): Promise<void> => {
  const plugin: IPlugin = app.getPluginByName('@gluestack-v2/glue-plugin-functions') as IPlugin;
  if (plugin) {
    // @ts-ignore
    await plugin.build();
  }

  // for await (const plugin of app.plugins) {
  //   for await (const instance of plugin.instances) {
  //     success("Found instance", instance.getName());

  //     if (!instance.watch || !instance.watch().length) {
  //       warning(
  //         `${instance.getName()}`,
  //         "contains no watch method or it exists but returns an empty array"
  //       );
  //       continue;
  //     }

  //     warning(instance.getName(), "watching for changes");
  //     const cwd: string = join(process.cwd(), instance.getInstallationPath());

  //     // AppCLI watch API
  //     app.watch(cwd, instance.watch(), async (event: string, path: string) => {
  //       info(`${instance.getName()}`, `${event.green} :: ${path.yellow}`);

  //       // AppCLI write API
  //       await app.write(cwd, instance.getName());
  //     });
  //   }
  // }
};
