import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
import { join } from 'path';
import { writeStorageClient } from './helpers/write-storage-client';
import { GLUE_GENERATED_PACKAGES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import { writeStorageServerSdk } from './helpers/write-storage-server-sdk';

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

  getSourcePath(): string {
    return join(process.cwd(), 'server', this.getName());
  }

  async build() {
    await this.writeStorageService();
    const clientPackagePath = join(
      GLUE_GENERATED_PACKAGES_PATH,
      `${this.getName()}-client-sdk`
    );
    const sdkPath = join(this.callerPlugin.getPackagePath(), 'sdk');
    await this.app.createPackage(`${this.getName()}-client-sdk`, sdkPath);

    await this.app.updateNameInPackageJSON(
      sdkPath,
      `${this.getName()}-server-sdk`
    );
    await writeStorageClient(this.getName(), clientPackagePath);

    const serverPackagePath = join(
      GLUE_GENERATED_PACKAGES_PATH,
      `${this.getName()}-server-sdk`
    );
    await this.app.createPackage(`${this.getName()}-server-sdk`, sdkPath);

    await writeStorageServerSdk(this.getName(), serverPackagePath);

    // await this.writeSdkForStorageClient();
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

  async writeSdkForStorageClient() {
    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-sdk'
    ) as IPlugin;

    if (!plugin) {
      return;
    }
    // @ts-ignore
    plugin.generateStorageClient(this.getName());
  }

  async writeStorageService() {
    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    ) as IPlugin;

    if (!plugin) {
      return;
    }
    // @ts-ignore
    plugin.generateStorageClientService(this.getName());
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
}
