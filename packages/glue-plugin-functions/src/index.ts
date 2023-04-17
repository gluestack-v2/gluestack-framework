// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import chokidar from "chokidar";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import copyFolder from "./helpers/copy-folder";
import fileExists from "./helpers/file-exists";
import rm from "./helpers/rm";
import path from "path";
import fs from "fs";
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
    // this.app.addEventListener("booting.web", (...args: any[]): void => {
    //   console.log({ message: "booting web event listener", args });
    //   console.log(this.gluePluginStore.get("message"));
    //   this.gluePluginStore.set("message", "Hello from function plugin");
    //   console.log(this.gluePluginStore.get("message"));
    // });
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
    const rootPackage = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());
  }

  generateFunctionsInServiceGateway() {
    const instances = this.getInstances();
    for (const instance of instances) {
      const installationPath = instance.getInstallationPath();

      const plugin = this.app.getPluginByName(
        "@gluestack-v2/glue-plugin-service-gateway"
      ) as IPlugin;

      // @ts-ignore
      plugin.generateService(installationPath);
    }
  }

  generateFunctionsInServiceSdk() {
    const instances = this.getInstances();
    for (const instance of instances) {
      const installationPath = instance.getInstallationPath();
      const plugin = this.app.getPluginByName(
        "@gluestack-v2/glue-plugin-service-sdk"
      ) as IPlugin;
      //@ts-ignore
      plugin.generateSDK(installationPath);
    }

    //  Get instance by name and call its generate function in service sdk
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
  async build(): Promise<void> {
    return new Promise(async (resolve: any, reject) => {
      try {
        const plugin: IPlugin | null = this.app.getPluginByName(
          "@gluestack-v2/glue-plugin-functions"
        );
        if (!plugin || plugin.getInstances().length <= 0) {
          console.log("> No functions plugin found, skipping build");
          return;
        }

        // const instances: Array<IInstance> = plugin.getInstances();
        this.generateFunctionsInServiceGateway();
        this.generateFunctionsInServiceSdk();
        resolve("Build Successful");
      } catch (err) {
        reject(err);
      }
    });

    // Adding packages in all the seal services
    // const generatedServicesPath = path.join(
    //   process.cwd(),
    //   ".glue",
    //   "__generated__",
    //   "seal",
    //   "services"
    // );
    // const generatedServices = fs.readdirSync(generatedServicesPath);
    // console.log({ generatedServices });
    // for (const service of generatedServices) {
    //   if (
    //     await fileExists(
    //       path.join(generatedServicesPath, service, "src", "packages")
    //     )
    //   ) {
    //     rm(path.join(generatedServicesPath, service, "src", "packages"));
    //   }

    //   await copyFolder(
    //     path.join(process.cwd(), ".glue", "__generated__", "packages"),
    //     path.join(generatedServicesPath, service, "src"),
    //     7
    //   );
    // }

    // for await (const instance of instances) {
    //   const target: string = instance.getInstallationPath();
    //   const name: string = removeSpecialChars(instance.getName());

    //   await this.app.write(target, name);
    // }
  }
}
