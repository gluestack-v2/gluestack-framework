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
      {
        name: "POSTGRES_USER",
        type: "text",
        message: "Database user:",
        validate: (value: string) => value !== "",
      },
      {
        name: "POSTGRES_PASSWORD",
        type: "password",
        message: "Database password:",
        validate: (value: string) => value !== "",
      },
      {
        name: "POSTGRES_DB",
        type: "text",
        message: "Database name:",
        validate: (value: string) => value !== "",
      },
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
    const envContent = `ADMIN_SECRET_KEY=${answers.ADMIN_SECRET_KEY}
    POSTGRES_USER=${answers.POSTGRES_USER}
    POSTGRES_PASSWORD=${answers.POSTGRES_PASSWORD}
    POSTGRES_DB=${answers.POSTGRES_DB}
    DATABASE_URL=postgres://${answers.POSTGRES_USER}:${answers.POSTGRES_PASSWORD}@db:5432/${answers.POSTGRES_DB}`;

    // Write the .env file at database root
    fs.writeFileSync(join(instance._sourcePath, ".env"), envContent);

    const graphqlEnvContent = `HASURA_GRAPHQL_ADMIN_SECRET=${answers.ADMIN_SECRET_KEY}`;

    // Write the .env file at graphql root
    fs.writeFileSync(
      join(instance._sourcePath, "graphql/.env"),
      graphqlEnvContent
    );

    //Change DB name in metadata/databases/databases.yaml file
    let databaseFileContent = fs.readFileSync(
      join(instance._sourcePath, "graphql/metadata/databases/databases.yaml"),
      "utf-8"
    );

    //Change DB name in metadata/databases/databases.yaml file
    databaseFileContent = databaseFileContent.replace(
      "DB_NAME_TEMPLATE_STRING",
      answers.POSTGRES_DB
    );

    fs.writeFileSync(
      join(instance._sourcePath, "graphql/metadata/databases/databases.yaml"),
      databaseFileContent
    );

    // Create a database folder in migrations
    fs.mkdirSync(
      join(instance._sourcePath, "graphql/migrations", answers.POSTGRES_DB)
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

  testFunction() {
    console.log("test");
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  sealInit(SEAL_SERVICES_PATH: string, name: string) {
    // seal init and seal service add in the services folder
    const sealInit = spawnSync("sh", [
      "-c",
      `cd ${SEAL_SERVICES_PATH} && seal init`,
    ]);

    if (sealInit.status !== 0) {
      console.error(`Command failed with code ${sealInit.status}`);
    }
    console.log(sealInit.stdout.toString());
    console.error(sealInit.stderr.toString());

    const sealAddService = spawnSync("sh", [
      "-c",
      `cd ${SEAL_SERVICES_PATH} && seal service:add ${name} ./${name}/src`,
    ]);

    if (sealAddService.status !== 0) {
      console.error(`Command failed with code ${sealAddService.status}`);
    }
    console.log(sealAddService.stdout.toString());
    console.error(sealAddService.stderr.toString());
  }
}
