import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { join } from 'path';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
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

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.writeEventsService();
  }

  async writeEventsService() {
    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    ) as IPlugin;

    // @ts-ignore
    plugin.generateEventsService();
  }

  async watch(callback?: any) {
    await this.buildBeforeWatch();

    this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (events, path) => {
        if (callback) {
          await this.writeEventsService();
          callback(events, path);
        }
      }
    );
  }

  getSourcePath(): string {
    return `${process.cwd()}/${this.getPluginEnvironment()}/${this.getName()}`;
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
      this.getName()
    );
  }
}
