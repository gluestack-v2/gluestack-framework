// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';

import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
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
    await instance.updateSourcePackageJSON();
    await instance.updateRootPackageJSONWithSourcePath();

    // // update package.json'S name index with the new instance name
    // const pluginPackage = `${instance._sourcePath}/package.json`;
    // await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // // update root package.json's workspaces with the new instance name
    // const rootPackage: string = `${process.cwd()}/package.json`;
    // await Workspaces.append(rootPackage, instance._sourcePath);

    // // move seal.service.yaml into the new instance
    // await reWriteFile(
    //   `${instance.getSealServicefile()}`,
    //   instanceName,
    //   "INSTANCENAME"
    // );
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
  testFunction() {
    // eslint-disable-next-line no-console
    console.log('test');
  }
  getInstances(): IInstance[] {
    return this.instances;
  }
}
