import { join } from 'path';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import fileExists from './helpers/file-exists';
import fs from 'fs';

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
    return `${this._destinationPath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._destinationPath}/seal.service.yaml`;
  }

  getSourcePath(): string {
    return `${process.cwd()}/node_modules/${this.callerPlugin.getName()}/template`;
  }

  getDestinationPath(): string {
    return join(
      process.cwd(),
      '.glue',
      '__generated__',
      'packages',
      this.getName()
    );
  }

  async build() {
    // console.log("helllll")
    await this.app.createPackage(
      'client-sdk',
      join(this.callerPlugin.getPackagePath(), 'sdk')
    );
    await this.app.createPackage(
      'server-sdk',
      join(this.callerPlugin.getPackagePath(), 'sdk')
    );

    console.log(
      join(this.callerPlugin.getPackagePath(), 'sdk'),
      join(process.cwd(), '.glue/__generated__/packages')
    );
    const indexPath = join(
      process.cwd(),
      '.glue/__generated__/packages',
      'client-sdk',
      'src',
      'index.ts'
    );
    const serverIndexPath = join(
      process.cwd(),
      '.glue/__generated__/packages',
      'server-sdk',
      'src',
      'index.ts'
    );
    let data = fs.readFileSync(indexPath, { encoding: 'utf-8' });
    data = data.replace('SDKINSTANCE', 'clientSDK');
    data = data.replace('UPDATECONFIGTYPE', 'client-config');
    fs.writeFileSync(indexPath, data);
    data = fs.readFileSync(serverIndexPath, { encoding: 'utf-8' });
    data = data.replace('SDKINSTANCE', 'serverSDK');
    data = data.replace('UPDATECONFIGTYPE', 'server-config');
    fs.writeFileSync(serverIndexPath, data);
    // await this.app.write(this._sourcePath, this._destinationPath);
    // await this.updateDestinationPackageJSON();
    // await this.updateRootPackageJSONWithDestinationPath();
    // await this.app.updateServices();
  }

  async watch() {
    // NO NEED TO WATCH
    await this.buildBeforeWatch();

    // COPY THIS SECTION of code for any other plugin instace watch

    // this.app.watch(
    //   this._sourcePath,
    //   this._destinationPath,
    //   async (event, path) => {
    //     // TODO: OPTIMIZE UPDATES
    //     // this.app.updateServices();
    //   }
    // );
  }
}
