// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/gluestack-plugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import { join } from 'path';
import { copyFile, writeFile } from 'fs/promises';
import { reWriteFile } from './helpers/rewrite-file';
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
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
    const instance: IInstance =
      await this.app.createPluginInstance(
        this,
        instanceName,
        this.getTemplateFolderPath(),
        target
      );

    if (!instance) {
      return;
    }

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, 'INSTANCENAME');

    // update root package.json's workspaces with the new instance name
    const rootPackage: string = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());

    // move seal.service.yaml into the new instance
    await reWriteFile(`${instance.getSealServicefile()}`, instanceName, 'INSTANCENAME');

    // move dockerfile into the new instance
    if (instance.getDockerfile) {
      await reWriteFile(`${instance?.getDockerfile()}`, instanceName, 'INSTANCENAME');
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

  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName('@gluestack-v2/glue-plugin-web');
    if (!plugin || plugin.getInstances().length <= 0) {
      console.log('> No web plugin found, skipping build...');
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();
    for await (const instance of instances) {

      const source: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());

      // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
      await this.app.write(source, name);

      /**
       * @TODO:
       * 1. move below code to the glue-plugin-seal or something
       * 2. seal.service.yaml, dockerfile & package.json movement
       *    into .glue/seal/services/<instance-name>/src
       */
      const SEAL_SERVICES_PATH: string = '.glue/__generated__/seal/services';
      const destination: string = join(process.cwd(), SEAL_SERVICES_PATH, name, 'src');

      // move seal.service.yaml
      await copyFile(
        instance.getSealServicefile(),
        join(destination, 'seal.service.yaml')
      );


      // move dockerfile, if exists
      if (instance.getDockerfile) {
        await copyFile(
          instance?.getDockerfile(),
          join(destination, 'Dockerfile')
        );
      }

      // add package.json with workspaces
      const packageFile: string = join(destination, 'package.json');
      const packageContent: any = {
        name: name,
        private: true,
        workspaces: [name]
      }
      await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
    }
  }
}
