import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";

import { join } from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import { removeSpecialChars } from "@gluestack/helpers";

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

  getIgnoredPaths(): string[] {
    return ["middlewares", "events", "private"];
  }

  async watch(callback?: Function): Promise<void> {
    if (!(await fileExists(this._destinationPath))) {
      try {
        await this.build();
      } catch (error) {
        console.log(">> Instance does not exits:", this.getName());
        return;
      }
    }

    this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (event, path) => {
        // TODO: OPTIMIZE UPDATES
        this.generateFunctionsInServiceGateway();
        this.generateFunctionsInServiceSdk(this.getIgnoredPaths());

        if (callback) {
          callback(event, path);
        }
      }
    );
  }

  generateFunctionsInServiceGateway() {
    const name = this.getName();
    const installationPath = this._sourcePath;

    const plugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    ) as IPlugin;

    // @ts-ignore
    plugin.generateService(installationPath, name);
  }

  generateFunctionsInServiceSdk(ignoredPaths: any) {
    const plugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-sdk"
    ) as IPlugin;

    // @ts-ignore
    plugin.generateSDK(this._sourcePath, this.getName(), ignoredPaths);
  }

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    // @ts-ignore
    this.generateFunctionsInServiceGateway();

    // @ts-ignore
    this.generateFunctionsInServiceSdk(this.getIgnoredPaths());

    await this.app.updateServices();
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
  // Override getDestinationPath
  getDestinationPath() {
    const gatewayInstanceName: string = this.getGatewayInstanceInfo();

    return join(
      process.cwd(),
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      gatewayInstanceName,
      "src",
      gatewayInstanceName,
      this.getName()
    );
  }
}
