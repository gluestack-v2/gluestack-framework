// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

import path, { join } from "path";
import fs from "fs";
import { removeSpecialChars } from "@gluestack/helpers";
import fileExists from "./helpers/file-exists";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
import { spawnSync } from "child_process";
// @ts-ignore
import prompts from "prompts";

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
      // {
      //   name: "POSTGRES_USER",
      //   type: "text",
      //   message: "Database user:",
      //   validate: (value: string) => value !== "",
      // },
      // {
      //   name: "POSTGRES_PASSWORD",
      //   type: "password",
      //   message: "Database password:",
      //   validate: (value: string) => value !== "",
      // },
      // {
      //   name: "POSTGRES_DB",
      //   type: "text",
      //   message: "Database name:",
      //   validate: (value: string) => value !== "",
      // },
      {
        name: "ADMIN_SECRET_KEY",
        type: "text",
        message: "Admin Secret Key For Hasura Console:",
        validate: (value: string) => value !== "",
      },
    ];

    // Prompt the user for input values
    const answers = await prompts(questions);

    // Create the .env file content
    const envContent = `ADMIN_SECRET_KEY=${answers.ADMIN_SECRET_KEY}`;

    // Write the .env file at database root
    fs.writeFileSync(join(instance._sourcePath, ".env"), envContent);

    const graphqlEnvContent = `HASURA_GRAPHQL_ADMIN_SECRET=${answers.ADMIN_SECRET_KEY}`;

    // Write the .env file at graphql root
    fs.writeFileSync(
      join(instance._sourcePath, ".env"),
      graphqlEnvContent
    );

    instance.updateSourcePackageJSON();

    // //Change DB name in metadata/databases/databases.yaml file
    // let databaseFileContent = fs.readFileSync(
    //   join(instance._sourcePath, "metadata/databases/databases.yaml"),
    //   "utf-8"
    // );

    // fs.writeFileSync(
    //   join(instance._sourcePath, "metadata/databases/databases.yaml"),
    //   databaseFileContent
    // );

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
