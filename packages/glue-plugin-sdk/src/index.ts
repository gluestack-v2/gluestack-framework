// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import { join, resolve } from 'path';
import { removeSpecialChars, Workspaces } from '@gluestack/helpers';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import { reWriteFile } from './helpers/rewrite-file';
import copyFolder from './helpers/copy-folder';
import rm from './helpers/rm';

import { existsSync } from 'fs';
import writeSDK from './helpers/write-sdk';

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
    this.runningPlatforms = [];
  }

  init() {
    this.app.addEventListener('booting.web', (...args: any[]): void => {
      console.log({ message: 'booting web event listener', args });
      console.log(this.gluePluginStore.get('message'));
      this.gluePluginStore.set('message', 'Hello from function plugin');
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

  // getInstallationPath(target: string): string {
  //   return `./.glue/__generated__/packages/${target}/src/${target}`;
  // }

  getInternalFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/internal`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath()
      // target
    );

    if (!instance) {
      return;
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath?: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath ?? ''
    );
    this.instances.push(instance);
    return instance;
  }

  async generateSDK(
    sourcePath: string,
    instanceName: string,
    ignoredPaths: any
  ) {
    const instances = this.getInstances();
    if (this.instances.length === 0) {
      return;
    }

    for await (const instance of instances) {
      if (!existsSync(sourcePath)) {
        console.log('> No functions plugin found, create instance first');
      } else {
        await writeSDK(sourcePath, instance._destinationPath, ignoredPaths);
      }
    }
    this.app.updateServices();
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  getDockerfile(): string {
    return `${this.getInternalFolderPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInternalFolderPath()}/bolt.service.yaml`;
  }
}
