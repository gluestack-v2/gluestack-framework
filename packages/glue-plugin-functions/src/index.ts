// @ts-ignore
import packageJSON from '../package.json';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import { PluginInstance } from './PluginInstance';
import path, { join } from 'path';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';
  gluePluginStore: IGlueStorePlugin;
  pluginEnvironment: 'server' | 'client' = 'server';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
    this.runningPlatforms = [];
  }

  init() {
    //
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

  getType(): 'stateless' | 'stateful' | 'devonly' {
    return this.type;
  }

  // @ts-ignore
  // getTemplateFolderPath(): string {
  //   return join(process.cwd(), 'node_modules', this.getName(), 'template');
  // }

  getInstallationPath(target: string): string {
    return path.join(this.pluginEnvironment, target);
  }

  getPluginEnvironment(): 'server' | 'client' {
    return this.pluginEnvironment;
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target
    );

    if (!instance) {
      return;
    }

    instance.updateSourcePackageJSON();
    instance.updateRootPackageJSONWithSourcePath();
    // // update package.json'S name index with the new instance name
    // const pluginPackage = `${instance._sourcePath}/package.json`;
    // await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // // update root package.json's workspaces with the new instance name
    // const rootPackage = `${process.cwd()}/package.json`;
    // await Workspaces.append(rootPackage, instance._sourcePath);
  }

  // generateFunctionsInServiceSdk(ignoredPaths: string[]) {
  //   const instances = this.getInstances();
  //   for (const instance of instances) {
  //     const name = instance.getName();
  //     const installationPath = instance._sourcePath;

  //     const plugin = this.app.getPluginByName(
  //       "@gluestack-v2/glue-plugin-service-sdk"
  //     ) as IPlugin;

  //     // @ts-ignore
  //     plugin.generateSDK(installationPath, name, ignoredPaths);
  //   }
  // }

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

  getInstances(): IInstance[] {
    return this.instances;
  }
}
