// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import { join } from 'path';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPlugin';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';
import addCommand from './commands/add';
import listCommand from './commands/list';
import removeCommand from './commands/remove';
import prompts from 'prompts';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';
  pluginEnvironment: 'server' | 'client' = 'server';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.runningPlatforms = [];
  }

  init() {
    this.app.addCommand((program: ICommand) => addCommand(program, this.app));
    this.app.addCommand((program: ICommand) => listCommand(program, this.app));
    this.app.addCommand((program: ICommand) =>
      removeCommand(program, this.app)
    );
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

  getType(): 'stateless' | 'stateful' | 'devonly' {
    return this.type;
  }

  getInstallationPath(target: string): string {
    return join(this.pluginEnvironment, target);
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

  async addCronJob(cronJobResponses: prompts.Answers<string>) {
    const cronJobName = cronJobResponses['Cron Job Name'];
    const cronJobSchedule = cronJobResponses['Cron Job Schedule'];
    const cronJobPath = cronJobResponses['Cron Job Path'];
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? '';
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      'index.json'
    ));
    cronJson.push({
      name: cronJobName,
      schedule: cronJobSchedule,
      path: cronJobPath,
    });

    await writeFile(
      join(process.cwd(), instanceIntallationPath, 'index.json'),
      JSON.stringify(cronJson, null, 2)
    );
  }

  async removeCronJob(cronJobName: string) {
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? '';
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      'index.json'
    ));
    const cronJobIndex = cronJson.findIndex(
      (cronJob: { name: string }) => cronJob.name === cronJobName
    );
    cronJson.splice(cronJobIndex, 1);
    await writeFile(
      join(process.cwd(), instanceIntallationPath, 'index.json'),
      JSON.stringify(cronJson, null, 2)
    );
  }

  async listCronJobs() {
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? '';
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      'index.json'
    ));
    // eslint-disable-next-line no-console
    console.log(cronJson);
  }
}
