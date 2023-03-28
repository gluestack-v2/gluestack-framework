// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import IApp from '@gluestack-v2/framework-cli/build/types/app/interface/IApp';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import ILifeCycle from '@gluestack-v2/framework-cli/build/types/plugin/interface/ILifeCycle';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import IManagesInstances from '@gluestack-v2/framework-cli/build/types/plugin/interface/IManagesInstances';

// Do not edit the name of this class
export class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
  app: IApp;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';
  gluePluginStore: IGlueStorePlugin;

  constructor(app: IApp, gluePluginStore: IGlueStorePlugin) {
    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.addEventListener('booting.web', (...data: any) => {
      console.log({message: 'booting web event listener', data});

      console.log(this.gluePluginStore.get('message'));
      this.gluePluginStore.set('message', 'Hello from develop plugin');
      console.log(this.gluePluginStore.get('message'));
    });
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
    const plugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-develop",
    );
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

  getInstances(): IInstance[] {
    return this.instances;
  }
}
