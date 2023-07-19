import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
// import chokidar from "chokidar";
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { join } from 'path';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

export class PluginInstance extends BaseGluestackPluginInstance {
  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);
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

  getInstallationPath(): string {
    return this.installationPath;
  }

  async runPostUninstall() {}

  async build(): Promise<void> {
    let serviceGatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (serviceGatewayPlugin) {
      //@ts-ignore
      serviceGatewayPlugin.generateCrons(this._sourcePath, this.getName());
    }
  }

  async watch(callback?: Function): Promise<void> {
    const serviceGatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    await this.buildBeforeWatch();

    this.app.watch(this._sourcePath, '', async (events, path) => {
      if (serviceGatewayPlugin) {
        //@ts-ignore
        serviceGatewayPlugin.generateCrons(this._sourcePath, this.getName());
      }
      if (callback) {
        callback(events, path);
      }
    });
  }

  getSourcePath(): string {
    return join(process.cwd(), this.getPluginEnvironment(), this.getName());
  }

  getPluginEnvironment() {
    // @ts-ignore
    return this.callerPlugin.getPluginEnvironment();
  }

  getGatewayInstanceInfo() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (!plugin) {
      console.error(
        `Plugin "@gluestack-v2/glue-plugin-service-gateway" not found.`
      );
      return '';
    }

    const instances: Array<IInstance> | undefined = plugin.instances;
    if (!instances || instances.length <= 0) {
      console.error(
        `No instance with "@gluestack-v2/glue-plugin-service-gateway" found.`
      );
      return '';
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
      'src',
      gatewayInstanceName,
      'services',
      this.getName() + '.service.js'
    );
  }
}
