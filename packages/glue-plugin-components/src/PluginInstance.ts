import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import chokidar from "chokidar";
import path1, { join } from "path";
import fs, { unlinkSync } from "fs";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";

export class PluginInstance extends BaseGluestackPluginInstance {
  app: AppCLI;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;
  watchAddedFileMap: Map<string, boolean> = new Map();
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

  getInstallationPathFilesRecursively(dir: string): string[] {
    const files: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path1.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        files.push(...this.getInstallationPathFilesRecursively(file));
      } else {
        files.push(file);
      }
    });
    return files;
  }

  getDockerfile(): string {
    return `${this._workspacePath}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this._workspacePath}/seal.service.yaml`;
  }

  async build(): Promise<void> {
    this.app.write(this._sourcePath, this._destinationPath);
    this.app.updateServices();
  }

  getDestinationPath(): string {
    return join(
      process.cwd(),
      ".glue",
      "__generated__",
      "packages",
      this.getName()
    );
  }

  async watch(callback: any) {
    await this.buildBeforeWatch();

    await this.app.watch(
      this._sourcePath,
      this._destinationPath,
      (event, path) => {
        if (callback) {
          callback(event, path);
        }
      }
    );
    let serviceInstances = this.app.getAllServiceInstances();

    serviceInstances.forEach(async (serviceInstance) => {
      await this.app.watch(
        this._sourcePath,
        join(serviceInstance._workspacePath, "packages", this.getName()),
        (event, path) => {
          if (callback) {
            callback(event, path);
          }
        }
      );
    });
  }
}
