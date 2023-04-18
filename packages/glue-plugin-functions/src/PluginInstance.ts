import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
// import chokidar from "chokidar";
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

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }
  // watch(): string[] {
  //   return ["."];
  // }
  // watch(): string[] {
  //   console.log("watching", this.app);
  //   // let buildInstance = this.app.build();
  //   try {
  //     var watcher = chokidar.watch(this.getInstallationPath(), {
  //       ignored: /[\/\\]\./,
  //       persistent: true,
  //     });
  //     watcher.on("all", function (path: string) {
  //       // this.app;
  //     });
  //     // .on("addDir", function (path: string) {
  //     //   console.log("Directory", path, "has been added");
  //     // })
  //     // .on("change", function (path: string) {
  //     //   console.log("Fiasfasfasle", path, "has been changed");
  //     // })
  //     // .on("unlink", function (path: string) {
  //     //   console.log("File", path, "has been removed");
  //     // })
  //     // .on("unlinkDir", function (path: string) {
  //     //   console.log("Directory", path, "has been removed");
  //     // })
  //     // .on("error", function (error) {
  //     //   console.error("Error happened", error);
  //     // }
  //     // );
  //   } catch (err) {
  //     console.log("> watcher error:", err);
  //   }

  //   return [];}

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
          this.getSDKInstanceInfo(instanceName).destPath,
          this.getGatewayInstanceInfo("gateway").destPath,
        ];
        let srcPath = path1.join(process.cwd(), path);
        if (await fileExists(srcPath)) {
          const data = fs.readFileSync(srcPath, {
            encoding: "utf8",
          });
          destPath.map((target) => {
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
        // const srcPath=
        // const instanceName = `${path}`.split("/")[0];
        const instanceName = "sdk";
        let destPath = [
          this.getSDKInstanceInfo(instanceName).destPath,
          this.getGatewayInstanceInfo("gateway").destPath,
        ];
        // let srcPath = this.getSDKInstanceInfo(instanceName).srcPath;
        let srcPath = path1.join(process.cwd(), path);
        if (await fileExists(srcPath)) {
          const data = fs.readFileSync(srcPath, {
            encoding: "utf8",
          });
          destPath.map((target) => {
            writeFile(`${target}/${path}`, data);
            // @ts-ignore
            plugin.generateFunctionsInServiceGateway();
            // @ts-ignore
            plugin.generateFunctionsInServiceSdk();
          });
          // // @ts-ignore
          // plugin.generateFunctionsInServiceSdk();
        }
      }
      if (event === "unlink") {
        log(`File ${path} has been removed`);
        // const instanceName = `${path}`.split("/")[0];
        const instanceName = "sdk";
        let destPath = [
          this.getSDKInstanceInfo(instanceName).destPath,
          this.getGatewayInstanceInfo("gateway").destPath,
        ];
        destPath.map(async (target) => {
          if (await fileExists(`${target}/${path}`)) {
            unlinkSync(`${target}/${path}`);

            // this.app.generateFunctionsInServiceSdk();
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

    if (instances)
      for (const instance of instances) {
        if (instanceName == instance.getName()) {
          let destPath = this.getGatewayGeneratedPath(instanceName);
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

  getGatewayGeneratedPath(name: string) {
    return path1.join(
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
          // instance.getGeneratedPath()
        );
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

  getSDKInstanceInfo(instanceName: string) {
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
}
