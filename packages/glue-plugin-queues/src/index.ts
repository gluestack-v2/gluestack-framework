import {
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";
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
import { Workspaces } from "@gluestack/helpers";
import copyFolder from "./helpers/copy-folder";
import fileExists from "./helpers/file-exists";
// import { readfile } from "./helpers/read-file";
import { join } from "path";
import fs from "fs";
import writeFile from "./helpers/write-file";
import writeMoleculerConfig from "./helpers/write-moleculer-config";
import writeQueuesService from "./helpers/write-service";
// import writeCronService from "./helpers/write-cron-service";
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
    let queuesInstances = this.getInstances();

    let serviceGatewayPlugin = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );
    if (
      !serviceGatewayPlugin ||
      serviceGatewayPlugin.getInstances().length <= 0
    ) {
      console.log("> No functions plugin found, skipping build");
      return;
    }
    const serviceGatewayInstances: Array<IInstance> =
      serviceGatewayPlugin.getInstances();

    if (queuesInstances.length <= 0) {
      console.log("> No queues instances found, skipping build");
      return;
    }

    for await (const queuesInstance of queuesInstances) {
      serviceGatewayInstances.forEach(async (serviceGatewayInstance) => {
        const targetPkgJson: string = join(
          process.cwd(),
          serviceGatewayInstance.getInstallationPath(),
          "package.json"
        );
        if (await fileExists(targetPkgJson)) {
          const data = await require(targetPkgJson);
          if (!data.devDependencies) {
            data.devDependencies = {};
          }
          // hard-coded the version here
          data.devDependencies["@moleculer/channels"] = "^0.1.6";
          let stringData = JSON.stringify(data, null, 2);
          await fs.writeFileSync(targetPkgJson, stringData);
          success(
            "We have added @moleculer/channels to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
          );
        } else {
          warning(
            "We could not find the package.json for service-gateway instance\n Please add @moleculer/channels to your service-gateway package.json\n and restart your service-gateway instance \n"
          );
        }

        // Add middleware and import to moleculer.config.js of gateway instance
        const targetMoleculerConfig: string = join(
          process.cwd(),
          serviceGatewayInstance.getInstallationPath(),
          "moleculer.config.js"
        );
        writeMoleculerConfig(targetMoleculerConfig);

        writeQueuesService(
          this.getInstallationPath(queuesInstance.name),
          serviceGatewayInstance.getInstallationPath(),
          queuesInstance.name
        );

        // writeCronService(
        //   this.getInstallationPath(cronInstance.name),
        //   serviceGatewayInstance.getInstallationPath(),
        //   cronInstance.name
        // );

        // Write Queue Service
      });
    }

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
