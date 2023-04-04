// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import { readfile } from "./helpers/readfile";
import copyFolder from "./helpers/copy-folder";
import rm from "./helpers/rm";

import path from "path";
import fs from "fs";
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

  getInstallationPath(target: string): string {
    return `./${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target
    );

    if (!instance) {
      return;
    }

    // // rewrite router.js with the installed instance name
    // const routerFile = `${instance.getInstallationPath()}/router.js`;
    // await reWriteFile(routerFile, removeSpecialChars(instanceName), 'INSTANCENAME');

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

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

  async generateService(instancePath: any) {
    const instances = this.getInstances();

    const localInstancePath = path.resolve(process.cwd(), instancePath);
    for (const instance of instances) {
      const installationPath = instance.getInstallationPath();
      rm(path.resolve(process.cwd(), installationPath, instancePath));
      console.log(path);
      copyFolder(localInstancePath, installationPath, 3);
      // const data = await readfile(path);
      // console.log(data);
    }
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );
    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No functions plugin found, skipping build");
      return;
    }
    // this.generateService();
    const instances: Array<IInstance> = plugin.getInstances();

    for await (const instance of instances) {
      const target: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());

      await this.app.write(target, name);
    }
  }
}
