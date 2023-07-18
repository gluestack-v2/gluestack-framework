import { join } from 'path';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import reWriteFile from '@gluestack-v2/framework-cli/build/helpers/file/rewrite-file';
const yaml = require('js-yaml');
const fs = require('fs');

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

  updateContextInSealService() {
    const sealService = this.getSealServicefile();

    const yamlFile = fs.readFileSync(sealService, 'utf8');
    const data = yaml.load(yamlFile);

    // update content
    data.platforms.local.context = this._sourcePath;
    const updatedYaml = yaml.dump(data);

    fs.writeFileSync(sealService, updatedYaml);
  }

  async updateNextConfig() {
    await reWriteFile(
      join(this._destinationPath, 'next.config.js'),
      this._sourcePath,
      'SOURCEPATH'
    );
  }
  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.updateWorkspacePackageJSON();
    await this.boltInit();
    await this.app.updateServices();
    await this.generateEnvFiles();

    // // update next.config.js context for error mapping
    // await this.updateNextConfig();

    // await this.updateContextInSealService();
  }

  async watch(callback: any) {
    await this.buildBeforeWatch();
    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (events, path) => {
        if (path === 'next.config.js') {
          // update next.config.js context for error mapping
          await this.updateNextConfig();
        }

        if (callback) {
          callback(events, path);
        }
      }
    );
  }
}
