import fs, { unlinkSync } from 'fs';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { join, relative } from 'path';
import fileExists from './helpers/file-exists';
import writeFile from './helpers/write-file';
import { readfile } from './helpers/read-file';
import { spawn } from 'child_process';

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

  getDockerfile(): string {
    return `${this._sourcePath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._sourcePath}/seal.service.yaml`;
  }

  getSourcePath(): string {
    return `${process.cwd()}/server/${this.getName()}`;
  }

  async build(): Promise<void> {
    // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
    let gatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    let gatewayInstance = gatewayPlugin?.getInstances()[0];
    if (!gatewayInstance) {
      throw new Error('Gateway instance not found');
    }

    // console.log("gatewayPath", gatewayContext);
    // writeFile(gatewayContextPath, gatewayContext);
    this.app.write(
      this._sourcePath,
      join(gatewayInstance._destinationPath, this.getName())
    );

    console.log(
      'this._sourcePath',
      relative(gatewayInstance._destinationPath, '..')
    );

    // @ts-ignore
    await gatewayPlugin.generateMailerService(this._sourcePath, this.getName());
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    this.app.watch(this._sourcePath, this._destinationPath, () => {
      //
    });
  }
}
