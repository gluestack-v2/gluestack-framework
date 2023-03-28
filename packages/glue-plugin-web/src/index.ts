// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import IApp from '@gluestack-v2/framework-cli/build/types/app/interface/IApp';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import ILifeCycle from '@gluestack-v2/framework-cli/build/types/plugin/interface/ILifeCycle';
import IManagesInstances from '@gluestack-v2/framework-cli/build/types/plugin/interface/IManagesInstances';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import { reWriteFile } from './helpers/rewrite-file';

import { removeSpecialChars, Workspaces } from "@gluestack/helpers";

// Do not edit the name of this class
export class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
  app: IApp;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
  gluePluginStore: IGlueStorePlugin;

  constructor(app: IApp, gluePluginStore: IGlueStorePlugin) {
    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.dispatchEvent('booting.web', this.getName());
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
  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getInstallationPath(target: string): string {
    return `./${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: PluginInstance =
      await this.app.createPluginInstance(
        this,
        instanceName,
        this.getTemplateFolderPath(),
        target
      );

    if (!instance) {
      return;
    }

    // rewrite router.js with the installed instance name
    const routerFile = `${instance.getInstallationPath()}/router.js`;
    await reWriteFile(routerFile, removeSpecialChars(instanceName), 'INSTANCENAME');

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, 'INSTANCENAME');

    // update root package.json's workspaces with the new instance name
    const rootPackage = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());
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

  getInstances(): IInstance[] {
    return this.instances;
  }
}
