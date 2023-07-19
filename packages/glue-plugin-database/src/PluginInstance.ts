import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
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

  getSourcePath(): string {
    return join(process.cwd(), this.getPluginEnvironment(), this.getName());
  }

  getPluginEnvironment() {
    // @ts-ignore
    return this.callerPlugin.getPluginEnvironment();
  }

  async build(): Promise<void> {
    // moves the instance into .glue/bolt/services/<instance-name>/src/<instance-name>
    await this.app.write(this._sourcePath, this._destinationPath);
    this.boltInit();
    await this.generateEnvFiles();
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    await this.app.watch(this._sourcePath, this._destinationPath, () => {});
  }
}
