// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import { reWriteFile } from "./helpers/rewrite-file";
import { Workspaces } from "@gluestack/helpers";
// import { readfile } from "./helpers/read-file";
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

  generateQueuesInServiceGateway() {
    const instances = this.getInstances();
    for (const instance of instances) {
      const name = instance.getName();
      const installationPath = instance.getInstallationPath();

      const plugin = this.app.getPluginByName(
        "@gluestack-v2/glue-plugin-service-gateway"
      ) as IPlugin;

      // @ts-ignore
      plugin.generateQueuesService(installationPath, name);
      // console.log(plugin.generateQueuesService, "MADHAV");
    }
  }

  async build(): Promise<void> {
    return new Promise((resolve: any, reject) => {
      try {
        if (this.getInstances().length <= 0) {
          console.log("> No functions plugin found, skipping build");
          return;
        }

        this.generateQueuesInServiceGateway();
        // this.generateFunctionsInServiceSdk();

        resolve("Build Successful");
      } catch (err) {
        reject(err);
      }
    });

    // writeQueuesService(
    //   this.getInstallationPath(queuesInstance.name),
    //   serviceGatewayInstance.getInstallationPath(),
    //   queuesInstance.name
    // );

    // Write Queue Service
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
