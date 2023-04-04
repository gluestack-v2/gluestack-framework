// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/gluestack-plugin';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import buildCommand from './commands/build';
import watchCommand from './commands/watch';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.addCommand((program: ICommand) => buildCommand(program, this.app));
    this.app.addCommand((program: ICommand) => watchCommand(program, this.app));
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  async runPostInstall(_instanceName: string, _target: string) {
    const plugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-develop",
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `develop instance already installed as ${plugin.getInstances()[0].getName()}`,
      );
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath
    );
    this.instances.push(instance);
    return instance;
  }
}
