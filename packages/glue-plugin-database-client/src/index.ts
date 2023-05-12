// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import dotenv from "dotenv";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import fs from "fs";
import { join } from "path";
import prompts from "prompts";
import fileExists from "./helpers/file-exists";
import writeFile from "./helpers/write-file";
import { reWriteFile } from "./helpers/rewrite-file";
import { readfile } from "./helpers/read-file";
import rm from "./helpers/rm";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
    this.runningPlatforms = ["docker"];
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

    const databasePlugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-database"
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
        description: `Select a database instance for your database client instance ${instanceName}`,
        value: {
          name: databaseInstance.getName(),
          path: databaseInstance._sourcePath,
        },
      };
    });

    const questions: prompts.PromptObject[] = [
      {
        type: "select",
        name: "DATABASE_INSTANCE_NAME",
        message: "Select a database instance",
        choices: choices,
        validate: (value: string) => value !== "",
      },
    ];

    // Prompt the user for input values
    const answers = await prompts(questions);

    // Update the instance .env-local file
    const envPath = join(instance._sourcePath, ".env");

    dotenv.config({
      path: join(answers.DATABASE_INSTANCE_NAME.path, ".env"),
    });

    const { DATABASE_URL } = process.env;

    let localEnvData = `DATABASE_URL=${DATABASE_URL}`;
    await writeFile(envPath, localEnvData);
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
    console.log("test");
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
}
