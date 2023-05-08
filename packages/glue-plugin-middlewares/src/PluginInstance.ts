import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import path1, { join } from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";

export class PluginInstance extends BaseGluestackPluginInstance {
  app: AppCLI;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;

  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);

    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
  }

  init() {
    //
  }

  destroy() {
    //
  }

  // watch(): any {
  // this.app.watch(process.cwd(), this.getInstances(), async (event, path) => {
  //   const log = console.log.bind(console);
  //   // Add event listeners.

  //   if (event === "add") {
  //     // log(`File ${path} has been added`);
  //     const instanceName = `${path}`.split("/")[0];
  //     let destPath = this.getInstanceInfo(instanceName).destPath;
  //     let srcPath = path1.join(process.cwd(), path);
  //     if (await fileExists(srcPath)) {
  //       const data = fs.readFileSync(srcPath, {
  //         encoding: "utf8",
  //       });
  //       writeFile(`${destPath}/${path}`, data);
  //     }
  //   }
  //   if (event === "change") {
  //     log(`File ${path} has been changed`);
  //     // const srcPath=
  //     const instanceName = `${path}`.split("/")[0];
  //     let destPath = this.getInstanceInfo(instanceName).destPath;
  //     // let srcPath = this.getInstanceInfo(instanceName).srcPath;
  //     let srcPath = path1.join(process.cwd(), path);
  //     if (await fileExists(srcPath)) {
  //       const data = fs.readFileSync(srcPath, {
  //         encoding: "utf8",
  //       });
  //       writeFile(`${destPath}/${path}`, data);
  //     }
  //   }
  //   if (event === "unlink") {
  //     log(`File ${path} has been removed`);
  //     const instanceName = `${path}`.split("/")[0];
  //     let destPath = this.getInstanceInfo(instanceName).destPath;
  //     if (await fileExists(destPath)) {
  //       unlinkSync(`${destPath}/${path}`);
  //     }
  //   }
  // });
  // return [];
  // }

  getDockerfile(): string {
    return `${this._destinationPath}/Dockerfile`;
  }

  // getGeneratedPath(name: any) {
  //   return path1.join(
  //     process.cwd(),
  //     ".glue",
  //     "__generated__",
  //     "seal",
  //     "services",
  //     name,
  //     "src"
  //   );
  // }

  getSealServicefile(): string {
    return `${this._destinationPath}/seal.service.yaml`;
  }

  getGatewayInstanceInfo() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    if (!plugin) {
      console.error(
        `Plugin "@gluestack-v2/glue-plugin-service-gateway" not found.`
      );
      return "";
    }

    const instances: Array<IInstance> | undefined = plugin.instances;
    if (!instances || instances.length <= 0) {
      console.error(
        `No instance with "@gluestack-v2/glue-plugin-service-gateway" found.`
      );
      return "";
    }

    return instances[0].getName();
  }

  getSourcePath(): string {
    return `${process.cwd()}/server/${this.getName()}`;
  }

  // Override getDestinationPath
  getDestinationPath() {
    const gatewayInstanceName: string = this.getGatewayInstanceInfo();

    return join(
      process.cwd(),
      GLUE_GENERATED_SEAL_SERVICES_PATH,
      gatewayInstanceName,
      "src",
      gatewayInstanceName,
      this.getName()
    );
  }

  async build(): Promise<void> {
    await this.app.write(this._sourcePath, this._destinationPath);

    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    if (plugin) {
      //@ts-ignore
      plugin.generateMiddlewares(this._sourcePath, this.getName());
    }
  }

  async watch(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      (events, path) => {
        if (plugin) {
          //@ts-ignore
          plugin.generateMiddlewares(this._sourcePath, this.getName());
        }
      }
    );
  }
}
