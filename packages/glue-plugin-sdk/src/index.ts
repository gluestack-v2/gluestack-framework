// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import { GLUE_GENERATED_PACKAGES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import { createConfigPackageHelper } from './helpers/create-config-package';
import { join } from 'path';
// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';
  private generatedSDKPaths: Array<string>;

  getGeneratedSDKPaths() {
    return this.generatedSDKPaths;
  }
  setGeneratedSDKPaths(paths: string) {
    this.generatedSDKPaths.push(paths);
  }
  resetGeneratedSDKPaths() {
    if (Array.isArray(this.generatedSDKPaths)) {
      this.generatedSDKPaths.splice(0, this.generatedSDKPaths.length);
    }
  }

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = [];
    this.generatedSDKPaths = [];
  }

  init() {
    this.app.addEventListener('booting.web', (..._args: any[]): void => {
      this.gluePluginStore.set('message', 'Hello from function plugin');
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

  async runPostInstall(instanceName: string, _target: string) {
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

  getInstances(): IInstance[] {
    return this.instances;
  }

  getConfigPath() {
    return join(process.cwd(), 'config');
  }

  getGeneratedConfigPath(packageName: string) {
    return join(
      process.cwd(),
      GLUE_GENERATED_PACKAGES_PATH,
      `${packageName}-config`
    );
  }

  async createConfigPackage(packageName: string) {
    await createConfigPackageHelper(
      packageName,
      this.getConfigPath(),
      this.getGeneratedConfigPath(packageName),
      this
    );
  }
}
