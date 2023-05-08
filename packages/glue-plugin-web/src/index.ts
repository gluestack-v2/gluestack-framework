// @ts-ignore
import packageJSON from "../package.json";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import { join, relative } from "path";
import { spawnSync } from "child_process";
import { Workspaces } from "@gluestack/helpers";

import { PluginInstance } from "./PluginInstance";
import { reWriteFile } from "./helpers/rewrite-file";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = ["local", "docker"];
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
    await instance.updateSourcePackageJSON();
    await instance.updateRootPackageJSONWithSourcePath();

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

  // async sealInit(SEAL_SERVICES_PATH: string, name: string) {
  //   // seal init and seal service add in the services folder
  //   const sealInit = spawnSync("sh", [
  //     "-c",
  //     `cd ${SEAL_SERVICES_PATH} && seal init`,
  //   ]);

  //   if (sealInit.status !== 0) {
  //     console.error(`Command failed with code ${sealInit.status}`);
  //   }
  //   console.log(sealInit.stdout.toString());
  //   console.error(sealInit.stderr.toString());

  //   const sealAddService = spawnSync("sh", [
  //     "-c",
  //     `cd ${SEAL_SERVICES_PATH} && seal service:add ${name} ./${name}/src`,
  //   ]);

  //   if (sealAddService.status !== 0) {
  //     console.error(`Command failed with code ${sealAddService.status}`);
  //   }
  //   console.log(sealAddService.stdout.toString());
  //   console.error(sealAddService.stderr.toString());
  // }
}
