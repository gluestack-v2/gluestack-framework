import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
import { join } from 'path';
import fileExists from '@gluestack-v2/framework-cli/build/helpers/file/file-exists';
import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import { defaultConfig } from './commands/minioConfig';

export class PluginInstance extends BaseGluestackPluginInstance {
  status: 'up' | 'down' = 'down';
  portNumber: any;
  consolePortNumber: any;
  publicBucketName: string = 'public';
  privateBucketName: string = 'private';

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

  setPortNumber(portNumber: number) {
    this.portNumber = portNumber || null;
    // this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  getPublicBucketName(): string {
    return this.publicBucketName;
  }

  getPrivateBucketName(): string {
    return this.privateBucketName;
  }

  setConsolePortNumber(consolePortNumber: number) {
    this.portNumber = consolePortNumber || null;
    // this.callerInstance.gluePluginStore.set(
    //   "console_port_number",
    //   consolePortNumber || null,
    // );
    return (this.consolePortNumber = consolePortNumber || null);
  }
  async getEnv() {
    const minio_credentials = defaultConfig;

    return {
      MINIO_ADMIN_END_POINT: minio_credentials.admin_end_point,
      MINIO_CDN_END_POINT: minio_credentials.cdn_end_point,
      MINIO_PORT: parseInt(minio_credentials.port),
      MINIO_USE_SSL: false,
      MINIO_ACCESS_KEY: minio_credentials.username,
      MINIO_SECRET_KEY: minio_credentials.password,
      MINIO_PUBLIC_BUCKET: this.getPublicBucketName(),
      MINIO_PRIVATE_BUCKET: this.getPrivateBucketName(),
    };
  }

  async getPortNumber() {
    return new Promise((resolve) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      // let ports = [10310];
      this.setPortNumber(10310);

      //   this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      // DockerodeHelper.getPort(10310, ports)
      // .then((port: number) => {
      //   this.setPortNumber(10310);
      //   ports.push(port);
      //   // this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
      //   return resolve(this.portNumber);
      // })
      // .catch((e: any) => {
      //   reject(e);
      // });
    });
  }

  async getConsolePortNumber() {
    // returnDefault?: boolean
    return new Promise((resolve) => {
      if (this.consolePortNumber) {
        return resolve(this.consolePortNumber);
      }
      // let ports = [9160];
      this.setConsolePortNumber(9160);
      //   this.callerInstance.callerPlugin.gluePluginStore.get("console_ports") ||
      //   [];
      // DockerodeHelper.getPort(9160, ports)
      //   .then((port: number) => {
      //     this.setConsolePortNumber(port);
      //     ports.push(port);
      //     this.callerInstance.callerPlugin.gluePluginStore.set(
      //       "console_ports",
      //       ports
      //     );
      //     return resolve(this.consolePortNumber);
      //   })
      //   .catch((e: any) => {
      //     reject(e);
      //   });
    });
  }

  getSourcePath(): string {
    return join(process.cwd(), this.getPluginEnvironment(), this.getName());
  }

  getPluginEnvironment() {
    // @ts-ignore
    return this.callerPlugin.getPluginEnvironment();
  }

  // TODO: Move to index.ts
  getInstallationPath(): string {
    return join('server', this.getName());
  }

  async editboltAndDockerFile(): Promise<void> {
    try {
      const runDockerfileTemplate = `
FROM quay.io/minio/minio

# Set the working directory
WORKDIR /data

# Expose the required ports
EXPOSE 9000
EXPOSE 9001

# Set the default environment variables
# ENV MINIO_ACCESS_KEY gluestack
# ENV MINIO_SECRET_KEY password

# Start the Minio server
CMD ["server", "/data", "--console-address", ":9001"]
`;

      const boltServiceTemplate = `container_name: ${this.getName()}
stateless: true
default_service_runner: docker
service_discovery_offset:
  - 9160
supported_service_runners:
  - docker
service_runners:
  local:
    envfile: .env
    build: npm run install --workspaces --if-present && npm run dev
  docker:
    envfile: .env
    build: ./run.Dockerfile
    ports:
      - 10310:9000
      - 9160:9001

`;

      writeFile(
        join(this._destinationPath, 'bolt.service.yaml'),
        boltServiceTemplate
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

  async build(): Promise<void> {
    // moves the instance into .glue/bolt/services/<instance-name>/src/<instance-name>
    await this.app.write(this._sourcePath, this._destinationPath);
    // this.getEnv();
    // await this.getPortNumber();
    // await this.getConsolePortNumber();
    this.boltInit();
    this.editboltAndDockerFile();
    // this.setStatus("up");

    // create buckets
    // await new Promise(async (resolve, reject) => {
    //   createBucket(this)
    //     .then(() => {
    //       return resolve(true);
    //     })
    //     .catch((e) => {
    //       console.log("\x1b[33m");
    //       console.log(
    //         `Could not create buckets, please create public and private buckets manually`
    //       );
    //       console.log("\x1b[0m");
    //     });

    //   return resolve(true);
    // });
    // this.boltInit();
  }

  async watch(): Promise<void> {
    if (!(await fileExists(this._destinationPath))) {
      try {
        await this.build();
      } catch (error) {
        console.error('>> Instance does not exits:', this.getName());
        return;
      }
    }

    await this.app.watch(this._sourcePath, this._destinationPath, () => {});
  }
}
