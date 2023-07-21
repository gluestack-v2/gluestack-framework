// @ts-ignore
import packageJSON from '../package.json';

import { AppCLI, BaseGluestackPlugin } from '@gluestack-v2/framework-cli';
import type { IInstance, IGlueStorePlugin } from '@gluestack-v2/framework-cli';
import { PluginInstance } from './PluginInstance';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
  pluginEnvironment: 'server' | 'client' = 'client';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = ['local', 'docker'];
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

  getInstallationPath(target: string): string {
    return `./${this.pluginEnvironment}/${target}`;
  }

  getPluginEnvironment() {
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
    await instance.updateSourcePackageJSON();
    await instance.updateRootPackageJSONWithSourcePath();
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

  // async boltInit(bolt_SERVICES_PATH: string, name: string) {
  //   // bolt init and bolt service add in the services folder
  //   const boltInit = spawnSync("sh", [
  //     "-c",
  //     `cd ${bolt_SERVICES_PATH} && bolt init`,
  //   ]);

  //   if (boltInit.status !== 0) {
  //     console.error(`Command failed with code ${boltInit.status}`);
  //   }
  //   console.log(boltInit.stdout.toString());
  //   console.error(boltInit.stderr.toString());

  //   const boltAddService = spawnSync("sh", [
  //     "-c",
  //     `cd ${bolt_SERVICES_PATH} && bolt service:add ${name} ./${name}/src`,
  //   ]);

  //   if (boltAddService.status !== 0) {
  //     console.error(`Command failed with code ${boltAddService.status}`);
  //   }
  //   console.log(boltAddService.stdout.toString());
  //   console.error(boltAddService.stderr.toString());
  // }
}
