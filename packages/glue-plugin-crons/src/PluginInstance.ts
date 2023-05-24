import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
// import chokidar from "chokidar";
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import chokidar from 'chokidar';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import path1, { join } from 'path';
import fs, { unlinkSync } from 'fs';
import writeFile from './helpers/write-file';
import fileExists from './helpers/file-exists';
import copyFolder from './helpers/copy-folder';
import { success, warning } from './helpers/print';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

export class PluginInstance extends BaseGluestackPluginInstance {
  app: AppCLI;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;

  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);

    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }

  async runPostUninstall() {
    // let serviceGatewayPlugin = this.app.getPluginByName(
    //   "@gluestack-v2/glue-plugin-service-gateway"
    // );
    // if (
    //   !serviceGatewayPlugin ||
    //   serviceGatewayPlugin.getInstances().length <= 0
    // ) {
    //   console.log("> No functions plugin found, skipping build");
    //   return;
    // }
    // const serviceGatewayInstances: Array<IInstance> =
    //   serviceGatewayPlugin.getInstances();
    // for await (const serviceGatewayInstance of serviceGatewayInstances) {
    //   const targetPkgJson: string = join(
    //     process.cwd(),
    //     serviceGatewayInstance.getInstallationPath(),
    //     "package.json"
    //   );
    //   if (await fileExists(targetPkgJson)) {
    //     const data = await require(targetPkgJson);
    //     if (data.devDependencies?.["moleculer-cron"]) {
    //       delete data.devDependencies["moleculer-cron"];
    //     }
    //     let stringData = JSON.stringify(data, null, 2);
    //     await fs.writeFileSync(targetPkgJson, stringData);
    //     success(`> Removed moleculer-cron from ${targetPkgJson}`);
    //   } else {
    //     warning(
    //       `No package.json found in ${serviceGatewayInstance.getInstallationPath()}/package.json skipping cleaning package.json`
    //     );
    //   }
    // }
  }

  async build(): Promise<void> {
    let serviceGatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (serviceGatewayPlugin) {
      //@ts-ignore
      serviceGatewayPlugin.generateCrons(this._sourcePath, this.getName());
    }
  }

  async watch(callback?: Function): Promise<void> {
    let serviceGatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    await this.buildBeforeWatch();

    this.app.watch(this._sourcePath, '', async (events, path) => {
      if (serviceGatewayPlugin) {
        //@ts-ignore
        serviceGatewayPlugin.generateCrons(this._sourcePath, this.getName());
      }
      if (callback) {
        callback(events, path);
      }
    });
  }

  getSourcePath(): string {
    return `${process.cwd()}/${this.getPluginEnvironment()}/${this.getName()}`;
  }

  getPluginEnvironment() {
    const cronsPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-crons'
    );
    if (!cronsPlugin) {
      return;
    }
    // @ts-ignore
    return cronsPlugin.getPluginEnvironment();
  }

  getGatewayInstanceInfo() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (!plugin) {
      console.error(
        `Plugin "@gluestack-v2/glue-plugin-service-gateway" not found.`
      );
      return '';
    }

    const instances: Array<IInstance> | undefined = plugin.instances;
    if (!instances || instances.length <= 0) {
      console.error(
        `No instance with "@gluestack-v2/glue-plugin-service-gateway" found.`
      );
      return '';
    }

    return instances[0].getName();
  }
  // Override getDestinationPath
  getDestinationPath() {
    const gatewayInstanceName: string = this.getGatewayInstanceInfo();

    return join(
      process.cwd(),
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      gatewayInstanceName,
      'src',
      gatewayInstanceName,
      'services',
      this.getName() + '.service.js'
    );
  }
}
