// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import { reWriteFile } from "./helpers/rewrite-file";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

// import { runner as postgresList } from "./commands/postgresList";
// import { runner as postgresConfig, writeInstance } from "./commands/postgresConfig";

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
  }

  init() {
    this.app.dispatchEvent("booting.database", this.getName());

    // this.app.addCommand((program: any) => postgresList(program, this));
    // this.app.addCommand((program: any) => postgresConfig(program, this));
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

  getInstallationPath(target: string): string {
    return `./${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const plugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-develop"
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `database instance already installed as ${plugin
          .getInstances()[0]
          .getName()}`
      );
    }

    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target
    );

    if (instance) {
      // await writeInstance(instance);
      // await createFolder(`${instance.getInstallationPath()}/db`);
      // await createFolder(`${instance.getInstallationPath()}/init.db`);
    }

    if (!instance) {
      return;
    }

    // rewrite router.js with the installed instance name
    // const routerFile = `${instance.getInstallationPath()}/router.js`;
    // await reWriteFile(
    //   routerFile,
    //   removeSpecialChars(instanceName),
    //   "INSTANCENAME"
    // );

    // update package.json'S name index with the new instance name
    // const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    // await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // update root package.json's workspaces with the new instance name
    const rootPackage = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());
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
