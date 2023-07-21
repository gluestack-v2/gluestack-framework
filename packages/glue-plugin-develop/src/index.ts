// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';
import {
  AppCLI,
  BaseGluestackPlugin,
  GLUE_GENERATED_PACKAGES_PATH,
} from '@gluestack-v2/framework-cli';
import type {
  IPlugin,
  IInstance,
  ICommand,
  IGlueStorePlugin,
} from '@gluestack-v2/framework-cli';
import upCommand from './commands/up';
import cleanCommand from './commands/clean';
import restartCommand from './commands/restart';
import startCommand from './commands/start';
import downCommand from './commands/down';
import buildCommand from './commands/build';
import watchCommand from './commands/watch';
import removeCommand from './commands/remove';
import prepareCommand from './commands/prepare';
import { createConfigPackage } from './helpers/create-config-package';
import { join } from 'path';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = [];
  }

  init() {
    this.app.addCommand((program: ICommand) => buildCommand(program, this));
    this.app.addCommand((program: ICommand) => watchCommand(program, this.app));
    this.app.addCommand((program: ICommand) =>
      removeCommand(program, this.app)
    );
    this.app.addCommand((program: ICommand) => upCommand(program, this.app));
    this.app.addCommand((program: ICommand) => downCommand(program, this.app));
    this.app.addCommand((program: ICommand) => cleanCommand(program, this.app));
    this.app.addCommand((program: ICommand) =>
      prepareCommand(program, this.app)
    );

    this.app.addCommand((program: ICommand) =>
      restartCommand(program, this.app)
    );
    this.app.addCommand((program: ICommand) => startCommand(program, this.app));
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

  getConfigPath = () => join(process.cwd(), 'config');
  getGeneratedConfigPath = (packageName: string) =>
    join(process.cwd(), GLUE_GENERATED_PACKAGES_PATH, `${packageName}-config`);

  async createConfigPackage(packageName: string) {
    await createConfigPackage(
      packageName,
      this.getConfigPath(),
      this.getGeneratedConfigPath(packageName)
    );
  }

  async runPostInstall(_instanceName: string, _target: string) {
    const plugin: IPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-develop'
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `develop instance already installed as ${plugin
          .getInstances()[0]
          .getName()}`
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

  async build() {
    //
  }

  async watch() {
    //
  }
}
