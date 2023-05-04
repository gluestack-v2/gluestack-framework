// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

import path, { join } from "path";
import fs from "fs";
import copyFile from "./helpers/copy-file";
import writeFile from "./helpers/write-file";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import fileExists from "./helpers/file-exists";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
    this.runningPlatforms = [];
  }

  init() {
    //
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
    await instance.updateSourcePackageJSON();
    await instance.updateRootPackageJSONWithSourcePath();

    // // update package.json'S name index with the new instance name
    // const pluginPackage = `${instance._sourcePath}/package.json`;
    // await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // // update root package.json's workspaces with the new instance name
    // const rootPackage: string = `${process.cwd()}/package.json`;
    // await Workspaces.append(rootPackage, instance._sourcePath);

    // // move seal.service.yaml into the new instance
    // await reWriteFile(
    //   `${instance.getSealServicefile()}`,
    //   instanceName,
    //   "INSTANCENAME"
    // );

    // move dockerfile into the new instance
    // if (instance.getDockerfile) {
    //   await reWriteFile(
    //     `${instance?.getDockerfile()}`,
    //     instanceName,
    //     "INSTANCENAME"
    //   );
    // }
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
  testFunction() {
    console.log("test");
  }
  getInstances(): IInstance[] {
    return this.instances;
  }
}
