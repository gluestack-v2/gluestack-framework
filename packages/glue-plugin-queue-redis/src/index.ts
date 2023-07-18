// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin';

import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

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

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  async runPostInstall(instanceName: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath()
      // target
    );

    if (!instance) {
      return;
    }

    //     const questions: prompts.PromptObject[] = [
    //       {
    //         name: "POSTGRES_USER",
    //         type: "text",
    //         message: "Database user:",
    //         validate: (value: string) => value !== "",
    //       },
    //       {
    //         name: "POSTGRES_PASSWORD",
    //         type: "password",
    //         message: "Database password:",
    //         validate: (value: string) => value !== "",
    //       },
    //       {
    //         name: "POSTGRES_DB",
    //         type: "text",
    //         message: "Database name:",
    //         validate: (value: string) => value !== "",
    //       }
    //     ];

    //     // Prompt the user for input values
    //     const answers = await prompts(questions);

    //     // Create the .env file content
    //     const envContent = `
    // POSTGRES_USER=${answers.POSTGRES_USER}
    // POSTGRES_PASSWORD=${answers.POSTGRES_PASSWORD}
    // POSTGRES_DB=${answers.POSTGRES_DB}
    // `;

    //     // Write the .env file at database root
    //     fs.writeFileSync(join(instance._sourcePath, ".env"), envContent);
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
