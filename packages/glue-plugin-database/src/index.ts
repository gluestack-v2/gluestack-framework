// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

import path, { join } from "path";
import fs from "fs";
import copyFile from "./helpers/copy-file";
import writeFile from "./helpers/write-file";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
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

    (async () => {
      const questions: prompts.PromptObject[] = [
        { name: "POSTGRES_USER", type: "text", message: "Database user:" },
        {
          name: "POSTGRES_PASSWORD",
          type: "password",
          message: "Database password:",
        },
        { name: "POSTGRES_DB", type: "text", message: "Database name:" },
        {
          name: "ADMIN_SECRET_KEY",
          type: "text",
          message: "Admin Secret Key For Hasura Console:",
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

      console.log(path.join(instance.getInstallationPath(), ".env"));
      // Write the .env file
      fs.writeFileSync(
        path.join(instance.getInstallationPath(), ".env"),
        envContent
      );
    })();

    // // update package.json'S name index with the new instance name
    // const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    // await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // // update root package.json's workspaces with the new instance name
    // const rootPackage: string = `${process.cwd()}/package.json`;
    // await Workspaces.append(rootPackage, instance.getInstallationPath());
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

  async build(): Promise<void> {
    // let instanceMap: any = {};
    // this.app.getPlugins().map((p) =>
    //   p.getInstances().map((i) => {
    //     if (instanceMap[i.getCallerPlugin().getName()]) {
    //       instanceMap[i.getCallerPlugin().getName()].push({
    //         path: i.getInstallationPath(),
    //         pluginName: i.getCallerPlugin().getName(),
    //         instanceName: i.getName(),
    //       });
    //     } else {
    //       instanceMap[i.getCallerPlugin().getName()] = [];
    //       instanceMap[i.getCallerPlugin().getName()].push({
    //         path: i.getInstallationPath(),
    //         pluginName: i.getCallerPlugin().getName(),
    //         instanceName: i.getName(),
    //       });
    //     }
    //   })
    // );

    // Copy packages folder to seal services
    // const generatedServices = fs.readdirSync(generatedWebPath);
    // for (const service of generatedServices) {

    // }

    // End Copy packages folder to seal services

    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-database"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No database plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();

    for await (const instance of instances) {
      const source: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());
      const generatedPkgPath = path.join(
        process.cwd(),
        ".glue",
        "__generated__",
        "packages"
      );
      const copyPkgPath = path.join(
        process.cwd(),
        ".glue",
        "__generated__",
        "seal",
        "services",
        name,
        "src"
      );

      // if (instanceMap?.["@gluestack-v2/glue-plugin-service-sdk"]) {
      //   for (const sdk of instanceMap?.[
      //     "@gluestack-v2/glue-plugin-service-sdk"
      //   ]) {
      //     let generatedWebPath = "";
      //     generatedWebPath = path.join(process.cwd(), sdk.path);
      if (await fileExists(path.join(copyPkgPath))) {
        console.log("Removing " + path.join(copyPkgPath));

        rm(path.join(copyPkgPath));
      }

      await copyFolder(path.join(generatedPkgPath), path.join(copyPkgPath), 7);

      // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
      await this.app.write(source, name);

      /**
       * @TODO:
       * 1. move below code to the glue-plugin-seal or something
       * 2. seal.service.yaml, dockerfile & package.json movement
       *    into .glue/seal/services/<instance-name>/src
       */
      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services";
      const destination: string = join(
        process.cwd(),
        SEAL_SERVICES_PATH,
        name,
        "src"
      );

      // move seal.service.yaml
      // await copyFile(
      //   instance.getSealServicefile(),
      //   join(destination, "seal.service.yaml")
      // );

      // // move dockerfile, if exists
      // if (instance.getDockerfile) {
      //   await copyFile(
      //     instance?.getDockerfile(),
      //     join(destination, "Dockerfile")
      //   );
      // }

      // add package.json with workspaces
      const packageFile: string = join(destination, "package.json");
      const packageContent: any = {
        name: name,
        private: true,
        workspaces: [name, "packages/**/src"],
        scripts: {
          "install-all": "npm install --workspaces --if-present",
          dev: "npm run dev --workspace @project/" + name,
        },
      };
      await writeFile(packageFile, JSON.stringify(packageContent, null, 2));

      this.sealInit(SEAL_SERVICES_PATH, name);
    }
  }
}
