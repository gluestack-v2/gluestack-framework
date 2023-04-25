import fs, { unlinkSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import { join } from "path";
import fileExists from "./helpers/file-exists";
import writeFile from "./helpers/write-file";

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

  watch(): string[] {
    this.app.watch(
      process.cwd(),
      this.getInstancesWatchPaths(),
      async (event, path) => {
        const log = console.log.bind(console);
        // Add event listeners.

        if (event === "add") {
          const instanceName = `${path}`.split("/")[0];
          let destPath = this.getInstanceInfo(instanceName).destPath;
          let srcPath = join(process.cwd(), path);
          if (await fileExists(srcPath)) {
            const data = fs.readFileSync(srcPath, {
              encoding: "utf8",
            });
            writeFile(`${destPath}/${path}`, data);
          }
        }
        if (event === "change") {
          log(`File ${path} has been changed`);

          const instanceName = `${path}`.split("/")[0];
          let destPath = this.getInstanceInfo(instanceName).destPath;
          let srcPath = join(process.cwd(), path);
          if (await fileExists(srcPath)) {
            const data = fs.readFileSync(srcPath, {
              encoding: "utf8",
            });
            writeFile(`${destPath}/${path}`, data);
          }
        }
        if (event === "unlink") {
          log(`File ${path} has been removed`);
          const instanceName = `${path}`.split("/")[0];
          let destPath = this.getInstanceInfo(instanceName).destPath;
          if (await fileExists(destPath)) {
            unlinkSync(`${destPath}/${path}`);
          }
        }
      }
    );
    return [];
  }

  getDockerfile(): string {
    return `${this.getInstallationPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInstallationPath()}/seal.service.yaml`;
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

  getInstancesWatchPaths() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-queues"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();
    let watchPaths = [];
    if (instances)
      for (const instance of instances) {
        console.log(
          instance.getInstallationPath(),
          this.getGeneratedPath(instance.getName())
          // instance.getGeneratedPath()
        );
        watchPaths.push(instance.getInstallationPath());
      }
    return watchPaths;
  }

  getInstanceInfo(instanceName: string) {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-queues"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();

    if (instances)
      for (const instance of instances) {
        if (instanceName == instance.getName()) {
          let destPath = this.getGeneratedPath(instanceName);
          let srcPath = join(process.cwd(), instance.getInstallationPath());
          return { destPath, srcPath };
        }
      }
    return {
      err: `No instance with ${instanceName} found.`,
      srcPath: "",
      destPath: "",
    };
  }
}
