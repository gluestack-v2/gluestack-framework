import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import { join } from "path";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import writeFile from "./helpers/write-file";
import { fileExists } from "@gluestack/helpers";

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

  // getInstallationPath(): string {
  //   return this.installationPath;
  // }

  getSourcePath(): string {
    return `${process.cwd()}/node_modules/${this.callerPlugin.getName()}/template`;
  }

  getGeneratedPath() {
    return join(
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      this.getName(),
      "src",
      this.getName()
    );
  }

  getDestinationPath(): string {
    return join(process.cwd(), this.getGeneratedPath());
  }

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.updateInstancePackageJSON();
    await this.updateRootPackageJSON();
    await this.updateWorkspacePackageJSON();
    await this.sealInit();
  }

  async watch() {

    if (!await fileExists(this._destinationPath)) {
      try {
        await this.build();
      } catch (error) {
        console.log('>> Instance does not exits:', this.getName());
        return;
      }
    }

    // this.app.watch(
    //   this._sourcePath,
    //   this._destinationPath,
    //   async (event, path) => {
    //     // TODO: OPTIMIZE UPDATES
    //     // this.app.updateServices();
    //   }
    // );


  }

  getDockerfile(): string {
    return `${this._destinationPath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._destinationPath}/seal.service.yaml`;
  }

}
