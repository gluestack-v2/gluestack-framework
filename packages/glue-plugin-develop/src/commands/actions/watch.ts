import { join } from "path";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import chokidar from "chokidar";
import {
  info,
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";

export default async (app: AppCLI): Promise<void> => {
  for await (const plugin of app.plugins) {
    for await (const instance of plugin.instances) {
      success("Found instance", instance.getName());
      console.log(instance.getInstallationPath());

      try {
        var watcher = chokidar.watch(instance.getInstallationPath(), {
          ignored: /[\/\\]\./,
          persistent: true,
        });
        watcher.on("change", async function (path: string) {
          // this.app;
          // if (!instance.getInstallationPath().includes("__generated__")) {
          //   warning("Building ", plugin.getName());
          //   if (plugin.build) {
          //     let res = await plugin.build();
          //     console.log(res);
          //   }
          // }
        });
        // watcher.
        // .on("addDir", function (path: string) {
        //   console.log("Directory", path, "has been added");
        // })
        // .on("change", function (path: string) {
        //   console.log("Fiasfasfasle", path, "has been changed");
        // })
        // .on("unlink", function (path: string) {
        //   console.log("File", path, "has been removed");
        // })
        // .on("unlinkDir", function (path: string) {
        //   console.log("Directory", path, "has been removed");
        // })
        // .on("error", function (error) {
        //   console.error("Error happened", error);
        // }
        // );
      } catch (err) {
        console.log("> watcher error:", err);
      }
      // if (!instance.watch || !instance.watch().length) {
      //   warning(
      //     `${instance.getName()}`,
      //     "contains no watch method or it exists but returns an empty array"
      //   );
      //   continue;
      // } else {
      //   warning(instance.getName(), "watching for changes");
      //   const cwd: string = join(process.cwd(), instance.getInstallationPath());
      //   console.log({ cwd });
      //   console.log(instance.watch);

      //   instance.watch();

      //   // AppCLI watch API
      //   // app.watch(
      //   //   cwd,
      //   //   instance.watch(cwd),
      //   //   async (event: string, path: string) => {
      //   //     info(`${instance.getName()}`, `${event.green} :: ${path.yellow}`);

      //   //     // AppCLI write API
      //   //     await app.write(cwd, instance.getName());
      //   //   }
      //   // );
      // }
    }
  }
};
