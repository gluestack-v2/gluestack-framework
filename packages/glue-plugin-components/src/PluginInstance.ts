import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
import { join } from 'path';

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

  async build(): Promise<void> {
    this.app.write(this._sourcePath, this._destinationPath);
    this.app.updateServices();
  }

  getDestinationPath(): string {
    return join(
      process.cwd(),
      '.glue',
      '__generated__',
      'packages',
      this.getName()
    );
  }

  async watch(callback: any) {
    await this.buildBeforeWatch();

    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      (event, path) => {
        if (callback) {
          callback(event, path);
        }
      }
    );
    let serviceInstances = this.app.getAllServiceInstances();

    serviceInstances.forEach(async (serviceInstance) => {
      await this.app.watch(
        this._sourcePath,
        join(serviceInstance._workspacePath, 'packages', this.getName()),
        (event, path) => {
          if (callback) {
            callback(event, path);
          }
        }
      );
    });
  }
}
