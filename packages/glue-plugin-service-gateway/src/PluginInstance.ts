import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import { join } from 'path';
import { GLUE_GENERATED_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';

export class PluginInstance extends BaseGluestackPluginInstance {
  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);
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

  // getInstallationPath(): string {
  //   return this.installationPath;
  // }

  getSourcePath(): string {
    return join(this.callerPlugin.getPackagePath(), 'template');
  }

  getGeneratedPath() {
    return join(
      GLUE_GENERATED_SERVICES_PATH,
      this.getName(),
      'src',
      this.getName()
    );
  }

  getDestinationPath(): string {
    return join(process.cwd(), this.getGeneratedPath());
  }

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.updateDestinationPackageJSON();
    await this.updateWorkspacePackageJSON();
    await this.boltInit();
    await this.generateEnvFiles();
  }

  //override updateWorkspacePackageJSON
  async updateWorkspacePackageJSON() {
    // // add package.json with workspaces
    const packageFile: string = join(this._workspacePath, 'package.json');
    const packageContent: any = {
      name: this.getName(),
      private: true,
      workspaces: [this.getName(), 'packages/**'],
      scripts: {
        'install:all':
          'npm install --workspaces --if-present --legacy-peer-deps',
        'build': 'npm run build --workspaces --if-present --legacy-peer-deps',
        'dev': 'npm run dev --workspace @project/' + this.getName(),
      },
    };

    await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
  }
}
