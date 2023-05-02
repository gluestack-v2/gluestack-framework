// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import { reWriteFile } from "./helpers/rewrite-file";

import { join } from "path";
import {
  fileExists,
  removeSpecialChars,
  Workspaces,
  writeFile,
} from "@gluestack/helpers";

import path from "path";
import writeService from "./helpers/write-service";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
import { spawnSync } from "child_process";

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
    this.app.addEventListener("booting.web", (...args: any[]): void => {
      console.log({ message: "booting web event listener", args });
      console.log(this.gluePluginStore.get("message"));
      this.gluePluginStore.set("message", "Hello from function plugin");
      console.log(this.gluePluginStore.get("message"));
    });
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

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  // getInstallationPath(target: string): string {
  //   return `./.glue/__generated__/seal/services/${target}/src/${target}`;
  // }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath()
      // target
    );

    if (!instance) {
      return;
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath?: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath ?? ""
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  async generateService(
    instancePath: string,
    instanceName: string,
    ignoredPaths: string[]
  ) {
    const instances = this.getInstances();
    for await (const instance of instances) {
      const functionsPath = path.resolve(process.cwd(), instancePath);

      const installationPath = instance._destinationPath;
      if (await fileExists(path.join(installationPath, instancePath))) {
        rm(path.join(installationPath, instancePath));
      }

      console.log('>> functions:', functionsPath);

      if (!(await fileExists(functionsPath))) {
        console.log("> No functions plugin found, create instance first");
      } else {
        await copyFolder(functionsPath, installationPath, 3);
        writeService(installationPath, instanceName, ignoredPaths);
      }
    }
  }

}
