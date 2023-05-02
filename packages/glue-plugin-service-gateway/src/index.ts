import {
  warning,
  success,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import fs from "fs";
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
import {
  fileExists,
  removeSpecialChars,
  Workspaces,
  writeFile,
} from "@gluestack/helpers";

import path from "path";
import writeService from "./helpers/write-service";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
import { spawnSync } from "child_process";
import writeMoleculerConfig from "./helpers/write-moleculer-config";
import writeQueuesService from "./helpers/write-queues-service";

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
    return `./.glue/__generated__/seal/services/${target}/src/${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath()
      // target
    );

    if (!instance) {
      return;
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath?: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath ?? ""
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  async generateService(instancePath: string, instanceName: string) {
    const instances = this.getInstances();
    for await (const instance of instances) {
      const functionsPath = path.resolve(process.cwd(), instancePath);

      const installationPath = instance.getInstallationPath();
      if (await fileExists(path.join(installationPath, instancePath))) {
        rm(path.join(installationPath, instancePath));
      }

      if (!(await fileExists(functionsPath))) {
        console.log("> No functions plugin found, create instance first");
      } else {
        await copyFolder(functionsPath, installationPath, 3);
        writeService(installationPath, instanceName);
      }
    }
  }

  async generateQueuesService(instancePath: string, instanceName: string) {
    // console.log("CALLED", instancePath, instanceName);
    const instances = this.getInstances();
    for await (const instance of instances) {
      const targetPkgJson: string = join(
        process.cwd(),
        instance.getInstallationPath(),
        "package.json"
      );

      if (await fileExists(targetPkgJson)) {
        const data = await require(targetPkgJson);
        if (!data.devDependencies) {
          data.devDependencies = {};
        }
        // hard-coded the version here
        data.devDependencies["moleculer-bee-queue"] = "^0.1.10";
        let stringData = JSON.stringify(data, null, 2);
        await fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added moleculer-bee-queue to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          "We could not find the package.json for service-gateway instance\n Please add moleculer-bee-queue to your service-gateway package.json\n and restart your service-gateway instance \n"
        );
      }
      writeQueuesService(instance.getInstallationPath(), instanceName);

      // Add middleware and import to moleculer.config.js of gateway instance
      // const targetMoleculerConfig: string = join(
      //   process.cwd(),
      //   instance.getInstallationPath(),
      //   "moleculer.config.js"
      // );
      // writeMoleculerConfig(targetMoleculerConfig);

      // const queuesPath = path.resolve(process.cwd(), instancePath);

      // const installationPath = instance.getInstallationPath();
      // if (await fileExists(path.join(installationPath, instancePath))) {
      //   rm(path.join(installationPath, instancePath));
      // }

      // if (!(await fileExists(queuesPath))) {
      //   console.log("> No queues plugin found, create instance first");
      // } else {
      //   await copyFolder(queuesPath, installationPath, 3);

      //   writeQueuesService(instance.getInstallationPath(), instanceName);
      // }
    }
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
      const name: string = removeSpecialChars(instance.getName());

      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services/";
      const sourcePath = join(this.getTemplateFolderPath());

      await this.app.write(sourcePath, name);

      let instanceName = instance.getName();
      // update package.json'S name index with the new instance name
      const pluginPackage = `${instance.getInstallationPath()}/package.json`;
      await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

      // update root package.json's workspaces with the new instance name
      const rootPackage: string = `${process.cwd()}/package.json`;
      await Workspaces.append(rootPackage, instance.getInstallationPath());

      /**
       * @TODO:
       * 1. move below code to the glue-plugin-seal or something
       * 2. seal.service.yaml, dockerfile & package.json movement
       *    into .glue/seal/services/<instance-name>/src
       */
      const destination: string = join(
        process.cwd(),
        SEAL_SERVICES_PATH,
        instance.name,
        "src"
      );

      // add package.json with workspaces
      const packageFile: string = join(destination, "package.json");
      const packageContent: any = {
        name: name,
        private: true,
        workspaces: [name, "packages/**/src"],
        scripts: {
          "install-all":
            "npm install --workspaces --if-present --legacy-peer-deps",
          dev: "npm run dev --workspace @project/" + name,
        },
      };

      await writeFile(packageFile, JSON.stringify(packageContent, null, 2));
      await this.sealInit(SEAL_SERVICES_PATH, name);
    }
  }
}
