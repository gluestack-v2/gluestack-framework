import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import chokidar from "chokidar";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance";

export class PluginInstance extends BaseGluestackPluginInstance {
  app: AppCLI;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;

  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);

    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }

  // watch(): string[] {
  //   return ["."];
  // }
  watch(): string[] {
    console.log("watching", this.app);
    // let buildInstance = this.app.build();
    try {
      var watcher = chokidar.watch(this.getInstallationPath(), {
        ignored: /[\/\\]\./,
        persistent: true,
      });
      watcher.on("all", function (path: string) {
        // this.app;
      });
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

    return [];
  }
}
