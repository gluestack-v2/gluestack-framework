// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import dotenv from 'dotenv';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';

import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import fs from 'fs';
import { join } from 'path';
import prompts from 'prompts';
import fileExists from './helpers/file-exists';
import writeFile from './helpers/write-file';
import { reWriteFile } from './helpers/rewrite-file';
import { readfile } from './helpers/read-file';
import rm from './helpers/rm';

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
    this.runningPlatforms = ['docker'];
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
    return `./server/${target}`;
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

    const questions: prompts.PromptObject[] = [
      {
        name: 'MAILER_HOST',
        type: 'text',
        message: 'Mailer host:',
        validate: (value: string) => value !== '',
      },
      {
        name: 'MAILER_PORT',
        type: 'text',
        message: 'Mailer port:',
        validate: (value: string) => value !== '',
      },
      {
        name: 'MAILER_USER',
        type: 'text',
        message: 'Mailer user:',
        validate: (value: string) => value !== '',
      },
      {
        name: 'MAILER_PASSWORD',
        type: 'password',
        message: 'Mailer password:',
        validate: (value: string) => value !== '',
      },
    ];

    // Prompt the user for input values
    const answers = await prompts(questions);

    // Create the .env file content
    const envContent = `
MAILER_USER=${answers.MAILER_USER}
MAILER_PASSWORD=${answers.MAILER_PASSWORD}
MAILER_HOST=${answers.MAILER_HOST}
`;

    // Write the .env file at database root
    fs.writeFileSync(join(instance._sourcePath, '.env'), envContent);
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
    console.log('test');
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
}
