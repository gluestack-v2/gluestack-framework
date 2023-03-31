import AppCLI from "../helpers/lib/app";

import IInstance from "./plugin/interface/IInstance";
import IGlueStorePlugin from "./store/interface/IGluePluginStore";
import ILifeCycle from "./plugin/interface/ILifeCycle";
import IPlugin from "./plugin/interface/IPlugin";

export default abstract class BaseGluestackPluginInstance implements IInstance, ILifeCycle {
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
    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
  }

  abstract init(): void;
  abstract destroy(): void;
  abstract watch(): string[];

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }
}
