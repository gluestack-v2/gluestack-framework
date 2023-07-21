import {
  AppCLI,
  BaseGluestackPluginInstance,
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
    super(app, callerPlugin, name, gluePluginStore, installationPath);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  async watch(): Promise<void> {
    //
  }

  async build(): Promise<void> {
    //
  }

  getDestinationPath(): string {
    return '';
  }
}
