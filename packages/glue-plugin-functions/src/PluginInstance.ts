import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance";

import { join } from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
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

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }

  watch(): any {
    this.app.watch(process.cwd(), this.getInstances(), async (event, path) => {
      const plugin: IPlugin | null = this.app.getPluginByName(
        "@gluestack-v2/glue-plugin-functions"
      );
      const log = console.log.bind(console);
      // Add event listeners.
      if (event === "add") {
        // const instanceName = `${path}`.split("/")[0];
        // TODO: Hardcoded instance name
        const instanceName = "sdk";
        let destPath = [
          this.getSDKInstanceInfo(instanceName)?.destPath,
          this.getGatewayInstanceInfo("gateway")?.destPath,
        ];
        let srcPath = join(process.cwd(), path);
        if (await fileExists(srcPath)) {
          const data = fs.readFileSync(srcPath, {
            encoding: "utf8",
          });
          destPath.forEach((target) => {
            writeFile(`${target}/${path}`, data);
            // @ts-ignore
            plugin.generateFunctionsInServiceGateway();
            // @ts-ignore
            plugin.generateFunctionsInServiceSdk();
          });
        }
      }
      if (event === "change") {
        log(`File ${path} has been changed`);
        const instanceName = "sdk";
        let destPath = [
          this.getSDKInstanceInfo(instanceName)?.destPath,
          this.getGatewayInstanceInfo("gateway")?.destPath,
        ];
        let srcPath = join(process.cwd(), path);
        if (await fileExists(srcPath)) {
          const data = fs.readFileSync(srcPath, {
            encoding: "utf8",
          });
          destPath.forEach((target) => {
            writeFile(`${target}/${path}`, data);
            // @ts-ignore
            plugin.generateFunctionsInServiceGateway();
            // @ts-ignore
            plugin.generateFunctionsInServiceSdk();
          });
        }
      }
      if (event === "unlink") {
        log(`File ${path} has been removed`);

        const instanceName = "sdk";
        let destPath = [
          this.getSDKInstanceInfo(instanceName)?.destPath,
          this.getGatewayInstanceInfo("gateway")?.destPath,
        ];

        destPath.forEach(async (target) => {
          if (await fileExists(`${target}/${path}`)) {
            unlinkSync(`${target}/${path}`);
            // @ts-ignore
            plugin.generateFunctionsInServiceGateway();
            // @ts-ignore
            plugin.generateFunctionsInServiceSdk();
          }
        });
      }
    });
    return [];
  }

  getGatewayInstanceInfo(instanceName: string) {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();
    if (!instances || instances.length <= 0) {
      return {
        err: `No instance with ${instanceName} found.`,
        srcPath: "",
        destPath: "",
      };
    }

    for (const instance of instances) {
      if (instanceName == instance.getName()) {
        let destPath = this.getGatewayGeneratedPath(instanceName);
        let srcPath = join(
          process.cwd(),
          instance.getInstallationPath()
        );
        return { destPath, srcPath };
      }
    }
  }

  getGatewayGeneratedPath(name: string) {
    return join(
      process.cwd(),
      ".glue",
      "__generated__",
      "seal",
      "services",
      name,
      "src",
      name
    );
  }

  getInstances() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-functions"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();
    let watchPaths = [];
    if (instances)
      for (const instance of instances) {
        console.log(
          instance.getInstallationPath(),
          this.getGeneratedPath(instance.getName())
        );
        watchPaths.push(instance.getInstallationPath());
      }
    return watchPaths;
  }

  getGeneratedPath(name: any) {
    return join(
      process.cwd(),
      ".glue",
      "__generated__",
      "packages",
      name,
      "src",
      name
    );
  }

  getSDKInstanceInfo(instanceName: string) {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-sdk"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();

    if (!instances || instances.length <= 0) {
      return {
        err: `No instance with ${instanceName} found.`,
        srcPath: "",
        destPath: "",
      };
    }

    for (const instance of instances) {
      if (instanceName == instance.getName()) {
        let destPath = this.getGeneratedPath(instanceName);
        let srcPath = join(
          process.cwd(),
          instance.getInstallationPath()
        );
        return { destPath, srcPath };
      }
    }
  }
}
