// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import { reWriteFile } from "./helpers/rewrite-file";

import { join } from "path";
import { copyFile } from "fs/promises";
import { fileExists, removeSpecialChars, Workspaces, writeFile } from "@gluestack/helpers";

import path from "path";
import fs from "fs";
import writeService from "./helpers/write-service";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
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

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getInstallationPath(target: string): string {
    return `./.glue/internals/${target}`;
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

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // update root package.json's workspaces with the new instance name
    const rootPackage: string = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());

    // move seal.service.yaml into the new instance
    await reWriteFile(
      `${instance.getSealServicefile()}`,
      instanceName,
      "INSTANCENAME"
    );

    // move dockerfile into the new instance
    if (instance.getDockerfile) {
      await reWriteFile(
        `${instance?.getDockerfile()}`,
        instanceName,
        "INSTANCENAME"
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

  getInstances(): IInstance[] {
    return this.instances;
  }

  async generateService(instancePath: any) {
    const instances = this.getInstances();
    for (const instance of instances) {
      const functionsPath = path.resolve(process.cwd(), instancePath);

      const installationPath = instance.getInstallationPath();
      if (
        await fileExists(
          path.join(installationPath, instancePath)
        )
      ) {
        rm(path.join(installationPath, instancePath));
      }

      if (!await fileExists(functionsPath)) {
        console.log("> No functions plugin found, create instance first");
      } else {
        await copyFolder(functionsPath, installationPath, 3);
        writeService(installationPath);
      }
    }
  }

  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );
    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No service-gateway plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();
    for await (const instance of instances) {
      const source: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());

      // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
      await this.app.write(source, name);

      /**
       * @TODO:
       * 1. move below code to the glue-plugin-seal or something
       * 2. seal.service.yaml, dockerfile & package.json movement
       *    into .glue/seal/services/<instance-name>/src
       */
      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services/";
      const destination: string = join(
        process.cwd(),
        SEAL_SERVICES_PATH,
        instance.name,
        "src"
      );
      // move seal.service.yaml
      await copyFile(
        instance.getSealServicefile(),
        join(destination, "seal.service.yaml")
      );

      // move dockerfile, if exists
      if (instance.getDockerfile) {
        await copyFile(
          instance?.getDockerfile(),
          join(destination, "Dockerfile")
        );
      }

      // add package.json with workspaces
      const packageFile: string = join(destination, "package.json");
      const packageContent: any = {
        name: name,
        private: true,
        workspaces: [name],
      };
      await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
    }
  }
}
