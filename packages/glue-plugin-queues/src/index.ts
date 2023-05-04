// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { Workspaces } from "@gluestack/helpers";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";
// import { readfile } from "./helpers/read-file";
// import writeCronService from "./helpers/write-cron-service";
// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "devonly";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
    this.runningPlatforms = [];
  }

  init() {
    // this.app.addEventListener("booting.web", (...args: any[]): void => {
    //   console.log({ message: "booting web event listener", args });
    //   console.log(this.gluePluginStore.get("message"));
    //   this.gluePluginStore.set("message", "Hello from function plugin");
    //   console.log(this.gluePluginStore.get("message"));
    // });
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  // @ts-ignore
  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  // getInstallationPath(target: string): string {
  //   return `./${target}`;
  // }

  async runPostInstall(instanceName: string, target: string) {
    const plugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-queues"
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `queues instance already installed as ${plugin
          .getInstances()[0]
          .getName()}`
      );
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

}
