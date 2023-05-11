import fs, { unlinkSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
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

  getDockerfile(): string {
    return `${this._sourcePath}/Dockerfile`;
  }

  getSourcePath(): string {
    return `${process.cwd()}/node_modules/${this.callerPlugin.getName()}/template`;
  }

  getSealServicefile(): string {
    return `${this._sourcePath}/seal.service.yaml`;
  }

  async build(): Promise<void> {
    // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
    await this.app.write(this._sourcePath, this._destinationPath);

    this.sealInit();
    this.editSealAndDockerFile();
  }

  async editSealAndDockerFile(): Promise<void> {
    try {
      let runDockerfileTemplate = `
        # Use an official Redis runtime as the base image
FROM redis:latest

# Set the working directory
WORKDIR /app

# Expose the Redis port
EXPOSE 6379

# Start Redis server
CMD ["redis-server"]
`;

      let sealServiceTemplate = `container_name: queueredis
stateless: true
platforms:
  docker:
    envfile: .env
    build: ./run.Dockerfile
    ports:
      - 6379:6379
`;

      writeFile(
        join(this._destinationPath, "seal.service.yaml"),
        sealServiceTemplate
      );

      writeFile(
        join(this._destinationPath, "run.Dockerfile"),
        runDockerfileTemplate
      );

      writeFile(
        join(this._destinationPath, "build.Dockerfile"),
        runDockerfileTemplate
      );
    } catch (error) {
      console.log("Error occured: ", error);
      return;
    }
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    await this.app.watch(this._sourcePath, this._destinationPath, () => { });
  }
}
