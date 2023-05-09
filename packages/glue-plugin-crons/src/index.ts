// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import chokidar from "chokidar";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { success, warning } from "./helpers/print";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import copyFolder from "./helpers/copy-folder";
import fileExists from "./helpers/file-exists";
import { readfile } from "./helpers/read-file";
import rm from "./helpers/rm";
import { join } from "path";
import fs from "fs";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";
import { ICommand } from "@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback";
import addCommand from "./commands/add";
import listCommand from "./commands/list";
import removeCommand from "./commands/remove";
import prompts from "prompts";
import writeFile from "./helpers/write-file";
// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "devonly";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
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

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  getInstallationPath(target: string): string {
    return `./server/${target}`;
  }

  // @ts-ignore
  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
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
    const cronJobName = cronJobResponses["Cron Job Name"];
    const cronJobSchedule = cronJobResponses["Cron Job Schedule"];
    const cronJobPath = cronJobResponses["Cron Job Path"];
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? "";
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      "index.json"
    ));
    cronJson.push({
      name: cronJobName,
      schedule: cronJobSchedule,
      path: cronJobPath,
    });

    await writeFile(
      join(process.cwd(), instanceIntallationPath, "index.json"),
      JSON.stringify(cronJson, null, 2)
    );
  }

  async removeCronJob(cronJobName: string) {
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? "";
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      "index.json"
    ));
    const cronJobIndex = cronJson.findIndex(
      (cronJob: { name: string }) => cronJob.name === cronJobName
    );
    cronJson.splice(cronJobIndex, 1);
    await writeFile(
      join(process.cwd(), instanceIntallationPath, "index.json"),
      JSON.stringify(cronJson, null, 2)
    );
  }

  async listCronJobs() {
    const instanceIntallationPath =
      this.getInstances()[0].installationPath ?? "";
    const cronJson = require(join(
      process.cwd(),
      instanceIntallationPath,
      "index.json"
    ));
    console.log(cronJson);
  }
}
