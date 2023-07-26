import dotenv from 'dotenv';
import { join } from 'path';
import prompts from 'prompts';
import {
  error,
  success,
} from '@gluestack-v2/framework-cli/build/helpers/print';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import fs from 'fs';
import prettier from 'prettier';
// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import migrateCommand from './commands/migrate';
import generateCommand from './commands/generate';
import dbCommand from './commands/db';
// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = ['docker'];
  }

  init() {
    this.app.addCommand((program: ICommand) =>
      migrateCommand(program, this.app)
    );
    this.app.addCommand((program: ICommand) =>
      generateCommand(program, this.app)
    );
    this.app.addCommand((program: ICommand) => dbCommand(program, this.app));
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
    return join('server', target);
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

    const databasePlugin: IPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-database'
    ) as IPlugin;
    if (databasePlugin) {
      const databaseInstances: IInstance[] = databasePlugin.instances;
      if (databaseInstances && databaseInstances.length >= 0) {
        const choices = databaseInstances.map((databaseInstance: IInstance) => {
          return {
            title: databaseInstance.getName(),
            description: `Select a database instance for your database client instance ${instanceName}`,
            value: {
              name: databaseInstance.getName(),
              path: databaseInstance._sourcePath,
            },
          };
        });

        const questions: prompts.PromptObject[] = [
          {
            type: 'select',
            name: 'DATABASE_INSTANCE_NAME',
            message: 'Select a database instance',
            choices: choices,
            validate: (value: string) => value !== '',
          },
        ];

        // Prompt the user for input values
        const answers = await prompts(questions);

        // Update the instance .env-local file
        const envPath = join(instance._sourcePath, '.env');

        dotenv.config({
          path: join(answers.DATABASE_INSTANCE_NAME.path, '.env'),
        });

        const { DATABASE_URL } = process.env;

        const localEnvData = `DATABASE_URL=${DATABASE_URL}`;
        await writeFile(envPath, localEnvData);
      }
    }

    await this.updateConfigFile(instanceName, 'client');
    // this.updateConfigFile(instanceName, 'server');
  }

  updateConfigFile(instanceName: string, configType: string = 'index') {
    const configPath = join(process.cwd(), 'config', `${configType}.ts`);
    const importName = `${instanceName}${
      configType.charAt(0).toUpperCase() + configType.slice(1)
    }`;
    const data = fs.readFileSync(configPath, 'utf-8');
    const newImport = `import ${importName} from '@project/${instanceName}-${configType}-sdk';\n`;
    const newProviderEntry = `${instanceName}: ${importName}`;

    if (!data.includes(newProviderEntry)) {
      this.addProviderEntry(data, newProviderEntry, configPath);
    } else {
      console.error('Provider entry already exists');
    }
    if (!data.includes(newImport)) {
      const modifiedContent = data.replace(
        'export const config = {',
        `${newImport}\n$&`
      );
      this.addProviderEntry(modifiedContent, newProviderEntry, configPath);
    } else {
      console.error('Import already exists');
    }
  }

  addProviderEntry(content: any, newProviderEntry: any, configPath: string) {
    if (!content.includes(newProviderEntry)) {
      const providerObjectRegex = /providers\s*:\s*{([\s\S]*?)}/;
      const match = content.match(providerObjectRegex);

      if (!match) {
        console.error("Couldn't find the 'providers' object in the file.");
        return;
      }

      content = content.replace(
        providerObjectRegex,
        `providers: {$1    ${newProviderEntry}}`
      );
    }

    // Step 3: Write the modified content back to the file
    fs.writeFile(
      configPath,
      prettier.format(content, { parser: 'babel-ts' }),
      'utf8',
      (err) => {
        if (err) {
          error('Error writing to file:', JSON.stringify(err));
          return;
        }
        success('File updated successfully!');
      }
    );
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
