// @ts-ignore
import packageJSON from "../package.json";


import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

import { join } from "path";
import { spawnSync } from "child_process";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";

import rm from "./helpers/rm";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import { PluginInstance } from "./PluginInstance";
import { reWriteFile } from "./helpers/rewrite-file";
import { rmdir } from "fs/promises";

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

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // update root package.json's workspaces with the new instance name
    const rootPackage: string = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());
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

  async sealInit(SEAL_SERVICES_PATH: string, name: string) {
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

  getGeneratedPath(name: any) {
    return join(
      process.cwd(),
      ".glue",
      "__generated__",
      "seal",
      "services",
      name,
      "src"
    );
  }

  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-web"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No web plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();

    for await (const instance of instances) {
      const source: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());
      const copyPkgPath = this.getGeneratedPath(name);

      // if (await fileExists(copyPkgPath)) {
      //   rm(copyPkgPath);
      // }

      // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
      await this.app.write(source, name);

      await this.app.updateServices();

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

      await this.sealInit(SEAL_SERVICES_PATH, name);
    }
  }
}
