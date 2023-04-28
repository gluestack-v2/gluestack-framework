import { join } from "path";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";

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
    if (instances) {
      for (const instance of instances) {
        watchPaths.push(instance.getInstallationPath());
      }
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

  getInstanceInfo(instanceName: string) {
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

  getDockerfile(): string {
    return `${this.getInstallationPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInstallationPath()}/seal.service.yaml`;
  }
}
