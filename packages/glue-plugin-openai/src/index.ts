// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import { join } from 'path';
import { copyFile } from 'fs/promises';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import runCommand from './commands/run';
import constructCommand from './commands/construct';

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
    this.app.addCommand((program: ICommand) => runCommand(program, this.app));
    this.app.addCommand((program: ICommand) => constructCommand(program, this.app));
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

  async runPostInstall(instanceName: string, target: string) {
    if (instanceName !== "openai") {
      throw new Error(
        'plugin instance should be always installed as "openai"',
      );
    }

    const plugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-openai",
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `openai instance already installed as ${plugin.getInstances()[0].getName()}`,
      );
    }

    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target
    );

    if (!instance) {
      return;
    }

    await copyFile(
      join(instance.getInstallationPath(), "/.env.example"),
      join(instance.getInstallationPath(), "/.env")
    );
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

  getConstructFilepath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/libs/construct.py`;
  }

  getRunFilepath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/libs/run.py`;
  }

  getRequirementsFilepath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/libs/requirements.txt`;
  }
}
