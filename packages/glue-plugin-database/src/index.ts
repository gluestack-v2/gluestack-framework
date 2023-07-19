// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import { join } from 'path';
import fs from 'fs';
import prompts from 'prompts';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
  pluginEnvironment: 'server' | 'client' = 'server';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
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

  getPluginEnvironment(): 'server' | 'client' {
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

    const questions: prompts.PromptObject[] = [
      {
        name: 'DATABASE_USER',
        type: 'text',
        message: 'Database user:',
        validate: (value: string) => value !== '',
      },
      {
        name: 'DATABASE_PASSWORD',
        type: 'password',
        message: 'Database password:',
        validate: (value: string) => value !== '',
      },
      {
        name: 'DATABASE_NAME',
        type: 'text',
        message: 'Database name:',
        validate: (value: string) => value !== '',
      },
    ];

    // Prompt the user for input values
    const answers = await prompts(questions);

    // Create the .env file content
    const envContent = `
POSTGRES_USER=${answers.DATABASE_USER}
POSTGRES_PASSWORD=${answers.DATABASE_PASSWORD}
POSTGRES_DB=${answers.DATABASE_NAME}
DATABASE_URL=postgres://${answers.DATABASE_USER}:${answers.DATABASE_PASSWORD}@localhost:5433/${answers.DATABASE_NAME}
`;

    // Write the .env file at database root
    fs.writeFileSync(join(instance._sourcePath, '.env'), envContent);
  }

  getInstallationPath(target: string): string {
    return join(this.pluginEnvironment, target);
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
}
