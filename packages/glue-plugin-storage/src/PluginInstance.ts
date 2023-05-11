import fs, { unlinkSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import { join } from "path";
import fileExists from "./helpers/file-exists";
import writeFile from "./helpers/write-file";
import { defaultConfig } from "./commands/minioConfig";

export class PluginInstance extends BaseGluestackPluginInstance {
  app: AppCLI;
  name: string;
  callerPlugin: IPlugin;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;
  status: "up" | "down" = "down";

  // TODO: Fix typings
  portNumber: any;
  consolePortNumber: any;
  publicBucketName: string = "public";
  privateBucketName: string = "private";

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

  getSealServicefile(): string {
    return `${this._sourcePath}/seal.service.yaml`;
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
    let minio_credentials = defaultConfig;

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

  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports = [10310];
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

  async getConsolePortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.consolePortNumber) {
        return resolve(this.consolePortNumber);
      }
      let ports = [9160];
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
    return `${process.cwd()}/server/${this.getName()}`;
  }

  // TODO: Move to index.ts
  getInstallationPath(): string {
    return `./server/${this.getName()}`;
  }

  async build(): Promise<void> {
    console.log("in build");
    console.log(this._sourcePath, this._destinationPath, "hihihi");

    // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
    await this.app.write(this._sourcePath, this._destinationPath);
    // this.getEnv();
    // await this.getPortNumber();
    // await this.getConsolePortNumber();
    this.sealInit();

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
    // this.sealInit();
  }

  async watch(): Promise<void> {
    if (!(await fileExists(this._destinationPath))) {
      try {
        await this.build();
      } catch (error) {
        console.log(">> Instance does not exits:", this.getName());
        return;
      }
    }

    await this.app.watch(this._sourcePath, this._destinationPath, () => {});
  }
}
