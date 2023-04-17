import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance";
import chokidar from "chokidar";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import path1 from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import copyFolder from "./helpers/copy-folder";
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

  watch(): any {
    return [];
  }

  getInstances() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-sdk"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();
    let watchPaths = [];
    if (instances)
      for (const instance of instances) {
        watchPaths.push(instance.getInstallationPath());
      }
    return watchPaths;
  }

  getGeneratedPath(name: any) {
    return path1.join(
      process.cwd(),
      ".glue",
      "__generated__",
      "packages",
      name,
      "src",
      name
    );
  }

  getInstanceInfo(instanceName: string) {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-sdk"
    );

    const instances: Array<IInstance> | undefined = plugin?.getInstances();

    if (instances)
      for (const instance of instances) {
        if (instanceName == instance.getName()) {
          let destPath = this.getGeneratedPath(instanceName);
          let srcPath = path1.join(
            process.cwd(),
            instance.getInstallationPath()
          );
          return { destPath, srcPath };
        }
      }
    return {
      err: `No instance with ${instanceName} found.`,
      srcPath: "",
      destPath: "",
    };
  }

  getDockerfile(): string {
    return `${this.getInstallationPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInstallationPath()}/seal.service.yaml`;
  }
}
