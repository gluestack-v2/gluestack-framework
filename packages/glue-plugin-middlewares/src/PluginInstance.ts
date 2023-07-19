import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { join } from 'path';
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

  getSourcePath(): string {
    return `${process.cwd()}/${this.getPluginEnvironment()}/${this.getName()}`;
  }

  getPluginEnvironment() {
    // @ts-ignore
    return this.callerPlugin.getPluginEnvironment();
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
      this.getName()
    );
  }

  async build(): Promise<void> {
    await this.app.write(this._sourcePath, this._destinationPath);

    const plugin: IPlugin | null = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (plugin) {
      //@ts-ignore
      plugin.generateMiddlewares(this._sourcePath, this.getName());
    }
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    const plugin: IPlugin | null = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      (events, path) => {
        if (plugin) {
          //@ts-ignore
          plugin.generateMiddlewares(this._sourcePath, this.getName());
        }
      }
    );
  }
}
