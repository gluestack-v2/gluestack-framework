import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import chokidar from "chokidar";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import path1, { join } from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";

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

  getDockerfile(): string {
    return `${this._destinationPath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._destinationPath}/seal.service.yaml`;
  }

  getSourcePath(): string {
    return `${process.cwd()}/server/${this.getName()}`;
  }

  async build() {
    // await this.app.write(this._sourcePath, this._destinationPath);
    await this.writeStorageService();
  }

  async watch(callback?: any) {
    this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (events, path) => {
        if (callback) {
          await this.writeStorageService();
          callback(events, path);
        }
      }
    );
  }

  async writeStorageService() {
    const plugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    ) as IPlugin;

    if (!plugin) {
      return;
    }
    // @ts-ignore
    plugin.generateStorageClientService(this.getName());
    // const envData = {
    //   endPoint: this.settings.endPoint,
    //   port: this.settings.port,
    //   useSSL: this.settings.useSSL,
    //   accessKey: this.settings.accessKey,
    //   secretKey: this.settings.secretKey,
    //   // region: this.settings.region,
    //   // transport: this.settings.transport,
    //   // sessionToken: this.settings.sessionToken,
    // };
  }

  getGatewayInstanceInfo() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    if (!plugin) {
      console.error(
        `Plugin "@gluestack-v2/glue-plugin-service-gateway" not found.`
      );
      return "";
    }

    const instances: Array<IInstance> | undefined = plugin.instances;
    if (!instances || instances.length <= 0) {
      console.error(
        `No instance with "@gluestack-v2/glue-plugin-service-gateway" found.`
      );
      return "";
    }

    return instances[0].getName();
  }
  // // Override getDestinationPath
  // getDestinationPath() {
  //   const gatewayInstanceName: string = this.getGatewayInstanceInfo();

  //   return join(
  //     process.cwd(),
  //     GLUE_GENERATED_SEAL_SERVICES_PATH,
  //     gatewayInstanceName,
  //     "src",
  //     gatewayInstanceName,
  //     this.getName()
  //   );
  // }
}
