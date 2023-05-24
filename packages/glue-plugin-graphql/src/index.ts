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

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: 'stateless' | 'stateful' | 'devonly' = 'stateless';
  gluePluginStore: IGlueStorePlugin;
  pluginEnvironment: 'server' | 'client' = 'server';

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
    return `./${this.pluginEnvironment}/${target}`;
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

    const databasePlugin: IPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-database'
    ) as IPlugin;
    if (!databasePlugin) {
      return;
    }

    const databaseInstances: IInstance[] = databasePlugin.instances;
    if (!databaseInstances || databaseInstances.length === 0) {
      return;
    }

    const choices = databaseInstances.map((databaseInstance: IInstance) => {
      return {
        title: databaseInstance.getName(),
        description: `Select a database instance for your graphql instance ${instanceName}`,
        value: databaseInstance._sourcePath,
      };
    });

    const questions: prompts.PromptObject[] = [
      {
        type: 'select',
        name: 'DB_INSTANCE_NAME',
        message: 'Select a database instance',
        choices: choices,
        validate: (value: string) => value !== '',
      },
      {
        name: 'HASURA_GRAPHQL_ADMIN_SECRET',
        type: 'text',
        message: `Admin Secret for GraphQL instance "${instanceName}"`,
        validate: (value: string) => value !== '',
      },
      {
        name: 'HASURA_GRAPHQL_JWT_SECRET',
        type: 'text',
        message: `JWT Secret for GraphQL instance "${instanceName}"`,
        validate: (value) =>
          value.length < 32
            ? 'JWT Secret should be at least 32 characters'
            : true,
      },
    ];

    // Prompt the user for input values
    const answers = await prompts(questions);

    const dbEnv: string = join(answers.DB_INSTANCE_NAME, '.env');
    if (await fileExists(dbEnv)) {
      dotenv.config({ path: dbEnv });
    }

    const databaseURL: string =
      'postgres://' +
      process.env.POSTGRES_USER +
      ':' +
      process.env.POSTGRES_PASSWORD +
      '@host.docker.internal:5432/' +
      process.env.POSTGRES_DB;

    const envContent = `
HASURA_GRAPHQL_ADMIN_SECRET="${answers.HASURA_GRAPHQL_ADMIN_SECRET}"
HASURA_GRAPHQL_JWT_SECRET="{\\\"type\\\": \\\"HS256\\\", \\\"key\\\": \\\"${answers.HASURA_GRAPHQL_JWT_SECRET}\\\"}"
HASURA_GRAPHQL_UNAUTHORIZED_ROLE="guest"
HASURA_GRAPHQL_LOG_LEVEL="DEBUG"
HASURA_GRAPHQL_ENABLE_CONSOLE="true"
HASURA_GRAPHQL_CORS_DOMAIN="*"
ACTION_BASE_URL="http://engine:3500/v1.0/invoke/engine/method/actions"
EVENT_BASE_URL="http://engine:3500/v1.0/invoke/engine/method/events"
HASURA_GRAPHQL_ENABLE_TELEMETRY="false"
JWT_KEY="HS256"
JWT_SECRET="${answers.HASURA_GRAPHQL_JWT_SECRET}"
GRAPHQL_URL="http://graphql:8080/v1/graphql"
HASURA_GRAPHQL_DB_NAME="${process.env.POSTGRES_DB}"
HASURA_GRAPHQL_URL="http://localhost:8080"
HASURA_GRAPHQL_METADATA_DATABASE_URL="${databaseURL}"
HASURA_GRAPHQL_DATABASE_URL="${databaseURL}"
`;

    // Write the .env file at graphql root
    await writeFile(join(instance._sourcePath, '.env'), envContent);

    // rewrite config.yaml file in installed instance
    await reWriteFile(
      join(instance._sourcePath, 'config.yaml'),
      answers.HASURA_GRAPHQL_ADMIN_SECRET,
      'HASURA_GRAPHQL_ADMIN_SECRET'
    );

    // rewrite databases.yaml file in installed instance
    await reWriteFile(
      join(instance._sourcePath, 'metadata', 'databases', 'databases.yaml'),
      process.env.POSTGRES_DB || '',
      'HASURA_GRAPHQL_DB_NAME'
    );

    instance.updateSourcePackageJSON();
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
