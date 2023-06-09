import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import { join } from 'path';
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import writeFile from './helpers/write-file';
import { fileExists } from '@gluestack/helpers';
import fs from 'fs';
import path from 'path';

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

  // getInstallationPath(): string {
  //   return this.installationPath;
  // }

  getSourcePath(): string {
    return `${process.cwd()}/node_modules/${this.callerPlugin.getName()}/template`;
  }

  getGeneratedPath() {
    return join(
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      this.getName(),
      'src',
      this.getName()
    );
  }

  getDestinationPath(): string {
    return join(process.cwd(), this.getGeneratedPath());
  }

  mergeEnv(existingEnv: string, newEnv: string) {
    const existingEnvLines = existingEnv.split('\n');
    const newEnvLines = newEnv.split('\n');

    const mergedEnvLines = [...existingEnvLines];

    for (const newEnvLine of newEnvLines) {
      const newEnvParts = newEnvLine.split('=');
      const newEnvKey = newEnvParts[0].trim();

      if (newEnvKey) {
        const existingLineIndex = mergedEnvLines.findIndex((line) => {
          const existingParts = line.split('=');
          const existingKey = existingParts[0].trim();
          return existingKey === newEnvKey;
        });

        if (existingLineIndex !== -1) {
          // If conflicting environment variable exists, throw an error
          // throw new Error(`Conflicting environment variable: ${newEnvKey}`);
          mergedEnvLines[existingLineIndex] = newEnvLine;
        } else {
          mergedEnvLines.push(newEnvLine);
        }
      }
    }

    return mergedEnvLines.join('\n');
  }

  updateEnv(envRootPath: string) {
    // check .env in this._destinationPath
    // if not exist, create .env,
    //read .env from envRootPath
    // merge and update .env
    // is conflicting env, throw error

    const rootPath = path.join(envRootPath, '.env');
    const destinationPath = path.join(this._destinationPath, '.env');
    // console.log(destinationPath, 'Hello');

    // Check if .env exists in the destination path
    if (!fs.existsSync(destinationPath)) {
      // If it doesn't exist, create a new .env file
      fs.writeFileSync(destinationPath, '');
    }

    // Read the existing .env file
    const existingEnv = fs.readFileSync(destinationPath, 'utf8');

    // Read the .env from envRootPath

    const newEnv = fs.readFileSync(rootPath, 'utf8');

    // Merge and update the .env files
    const mergedEnv = this.mergeEnv(existingEnv, newEnv);

    // Write the merged environment variables to the destination .env file
    fs.writeFileSync(destinationPath, mergedEnv);
  }

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    await this.updateDestinationPackageJSON();
    await this.updateWorkspacePackageJSON();
    await this.sealInit();
  }

  getDockerfile(): string {
    return `${this._destinationPath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._destinationPath}/seal.service.yaml`;
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
        dev: 'npm run dev --workspace @project/' + this.getName(),
      },
    };

    await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
  }
}
