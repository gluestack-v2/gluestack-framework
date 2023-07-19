import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
import { join } from 'path';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';

export class PluginInstance extends BaseGluestackPluginInstance {
  constructor(
    app: AppCLI,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ) {
    super(app, callerPlugin, name, gluePluginStore, installationPath);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getSourcePath(): string {
    return `${process.cwd()}/node_modules/${this.callerPlugin.getName()}/template`;
  }

  async build(): Promise<void> {
    // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
    await this.app.write(this._sourcePath, this._destinationPath);

    this.boltInit();
    this.editSealAndDockerFile();
  }

  async editSealAndDockerFile(): Promise<void> {
    try {
      const runDockerfileTemplate = `
        # Use an official Redis runtime as the base image
FROM redis:latest

# Set the working directory
WORKDIR /app

# Expose the Redis port
EXPOSE 6379

# Start Redis server
CMD ["redis-server"]
`;

      const sealServiceTemplate = `container_name: queueredis
stateless: true
platforms:
  docker:
    envfile: .env
    build: ./run.Dockerfile
    ports:
      - 6379:6379
`;

      writeFile(
        join(this._destinationPath, 'seal.service.yaml'),
        sealServiceTemplate
      );

      writeFile(
        join(this._destinationPath, 'run.Dockerfile'),
        runDockerfileTemplate
      );

      writeFile(
        join(this._destinationPath, 'build.Dockerfile'),
        runDockerfileTemplate
      );
    } catch (error) {
      console.error('Error occured: ', error);
      return;
    }
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    await this.app.watch(this._sourcePath, this._destinationPath, () => {});
  }
}
