// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import { readfile } from "./helpers/readfile";
import copyFolder from "./helpers/copy-folder";
import rm from "./helpers/rm";
import { join } from "path";
import { copyFile, writeFile } from "fs/promises";

import path from "path";
import fs from "fs";
import writeService from "./helpers/write-service";
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
  }

  init() {
    this.app.addEventListener("booting.web", (...args: any[]): void => {
      console.log({ message: "booting web event listener", args });
      console.log(this.gluePluginStore.get("message"));
      this.gluePluginStore.set("message", "Hello from function plugin");
      console.log(this.gluePluginStore.get("message"));
    });
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

  // @ts-ignore
  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getInstallationPath(target: string): string {
    return `./${target}`;
  }

  getInternalFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/internal`;
  }

  // async runPostInstall(instanceName: string, target: string) {
  //   const instance: IInstance = await this.app.createPluginInstance(
  //     this,
  //     instanceName,
  //     this.getTemplateFolderPath(),
  //     target
  //   );
  //   if (!instance) {
  //     return;
  //   }
  //   // // rewrite router.js with the installed instance name
  //   // const routerFile = `${instance.getInstallationPath()}/router.js`;
  //   // await reWriteFile(routerFile, removeSpecialChars(instanceName), 'INSTANCENAME');
  //   // update package.json'S name index with the new instance name
  //   const pluginPackage = `${instance.getInstallationPath()}/package.json`;
  //   await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");
  //   // update root package.json's workspaces with the new instance name
  //   const rootPackage = `${process.cwd()}/package.json`;
  //   await Workspaces.append(rootPackage, instance.getInstallationPath());
  //   // move seal.service.yaml into the new instance
  //   await reWriteFile(
  //     `${instance.getSealServicefile()}`,
  //     instanceName,
  //     "INSTANCENAME"
  //   );

  //   // move dockerfile into the new instance
  //   if (instance.getDockerfile) {
  //     await reWriteFile(
  //       `${instance?.getDockerfile()}`,
  //       instanceName,
  //       "INSTANCENAME"
  //     );
  //   }
  // }

  async runPostInstall(_instanceName: string, _target: string) {
    const plugin: IPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    ) as IPlugin;

    // Validation
    if (plugin?.getInstances()?.[0]) {
      throw new Error(
        `servicegateway instance already installed as ${plugin
          .getInstances()[0]
          .getName()}`
      );
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

  async generateService(instancePath: any) {
    const GLUE_GENERATED_SERVICE_PATH: string =
      ".glue/__generated__/seal/services" as const;

    const functionsPath = path.resolve(process.cwd(), instancePath);

    const installationPath = path.resolve(
      GLUE_GENERATED_SERVICE_PATH,
      "servicegateway/src/servicegateway"
    );
    if (
      fs.existsSync(path.resolve(process.cwd(), installationPath, instancePath))
    ) {
      rm(path.resolve(process.cwd(), installationPath, instancePath));
    }
    if (!fs.existsSync(functionsPath)) {
      console.log("> No functions plugin found, create instance first");
    } else {
      copyFolder(functionsPath, installationPath, 3);
      writeService();
    }
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
  getDockerfile(): string {
    return `${this.getInternalFolderPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInternalFolderPath()}/seal.service.yaml`;
  }
  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );
    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No functions plugin found, skipping build");
      return;
    }
    const GLUE_GENERATED_SERVICE_PATH: string =
      ".glue/__generated__/seal/services" as const;
    const installationPath = path.resolve(
      GLUE_GENERATED_SERVICE_PATH,
      "servicegateway/src/servicegateway"
    );

    await this.app.write(plugin.getInternalFolderPath(), "servicegateway");
    //   /**
    //    * @TODO:
    //    * 1. move below code to the glue-plugin-seal or something
    //    * 2. seal.service.yaml, dockerfile & package.json movement
    //    *    into .glue/seal/services/<instance-name>/src
    // */
    const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services";
    const destination: string = join(
      process.cwd(),
      SEAL_SERVICES_PATH,
      "/servicegateway",
      "src"
    );

    // move seal.service.yaml
    await copyFile(
      plugin.getSealServicefile(),
      join(destination, "seal.service.yaml")
    );

    // move dockerfile, if exists
    if (plugin.getDockerfile) {
      await copyFile(plugin?.getDockerfile(), join(destination, "Dockerfile"));
    }

    // add package.json with workspaces
    const packageFile: string = join(destination, "package.json");
    const packageContent: any = {
      name: "servicegateway",
      private: true,
      workspaces: ["servicegateway"],
    };
    await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
  }
}
