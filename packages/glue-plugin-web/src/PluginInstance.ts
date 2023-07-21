import { join } from 'path';
import {
  AppCLI,
  BaseGluestackPluginInstance,
  rewriteFile,
} from '@gluestack-v2/framework-cli';
import type { IPlugin, IGlueStorePlugin } from '@gluestack-v2/framework-cli';

export class PluginInstance extends BaseGluestackPluginInstance {
  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    // @ts-ignore
    super(app, callerPlugin, name, gluePluginStore, installationPath);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  async updateNextConfig() {
    await rewriteFile(
      join(this._destinationPath, 'next.config.js'),
      this._sourcePath,
      'SOURCEPATH'
    );
  }
  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.updateWorkspacePackageJSON();
    await this.boltInit();
    await this.app.updateServices();
    await this.generateEnvFiles();

    // // update next.config.js context for error mapping
    // await this.updateNextConfig();
  }

  async watch(callback: any) {
    await this.buildBeforeWatch();
    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (events, path) => {
        if (path === 'next.config.js') {
          // update next.config.js context for error mapping
          await this.updateNextConfig();
        }

        if (callback) {
          callback(events, path);
        }
      }
    );
  }
}
