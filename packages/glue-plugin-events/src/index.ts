// @ts-ignore
import packageJSON from "../package.json";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import { eventsTemplate } from "./helpers/template";
import { join } from "path";
import { spawnSync } from "child_process";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";

import rm from "./helpers/rm";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import { PluginInstance } from "./PluginInstance";
import { reWriteFile } from "./helpers/rewrite-file";
import { rmdir } from "fs/promises";
import copyFolder from "./helpers/copy-folder";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";

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
