import {
  warning,
  success,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import fs from "fs";
// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/BaseGluestackPlugin";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import { reWriteFile } from "./helpers/rewrite-file";

import { join } from "path";
import {
  fileExists,
  removeSpecialChars,
  Workspaces,
  writeFile,
} from "@gluestack/helpers";

import path from "path";
import writeService from "./helpers/write-service";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
import { spawnSync } from "child_process";
import writeMoleculerConfig from "./helpers/write-moleculer-config";
import writeQueuesService from "./helpers/write-queues-service";
import { readfile } from "./helpers/readfile";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "devonly";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.addEventListener("booting.web", (...args: any[]): void => {
      console.log({ message: "booting web event listener", args });
      console.log(this.gluePluginStore.get("message"));
      this.gluePluginStore.set("message", "Hello from function plugin");
      console.log(this.gluePluginStore.get("message"));
    });
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  // getInstallationPath(target: string): string {
  //   return `./.glue/__generated__/seal/services/${target}/src/${target}`;
  // }

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath()
      // target
    );

    if (!instance) {
      return;
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath?: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath ?? ""
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  async generateService(
    instancePath: string,
    instanceName: string,
    ignoredPaths: string[]
  ) {
    const instances = this.getInstances();
    if (this.instances.length === 0) {
      return;
    }
    for await (const instance of instances) {
      const functionsPath = path.resolve(process.cwd(), instancePath);

      const installationPath = instance._destinationPath;
      if (await fileExists(path.join(installationPath, instancePath))) {
        rm(path.join(installationPath, instancePath));
      }

      if (!(await fileExists(functionsPath))) {
        console.log("> No functions plugin found, create instance first");
      } else {
        await copyFolder(functionsPath, installationPath, 3);
        writeService(installationPath, instanceName, ignoredPaths);
      }
    }
  }

  async generateQueuesService(queueInstanceName: string) {
    if (this.instances.length === 0) {
      return;
    }

    const instances = this.getInstances();
    for await (const instance of instances) {
      const targetPkgJson: string = join(
        instance._destinationPath,
        "package.json"
      );

      if (await fileExists(targetPkgJson)) {
        const data = await require(targetPkgJson);
        if (!data.devDependencies) {
          data.devDependencies = {};
        }
        // hard-coded the version here
        data.devDependencies["moleculer-bee-queue"] = "^0.1.10";
        let stringData = JSON.stringify(data, null, 2);
        fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added moleculer-bee-queue to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          "We could not find the package.json for service-gateway instance\n Please add moleculer-bee-queue to your service-gateway package.json\n and restart your service-gateway instance \n"
        );
      }
      writeQueuesService(instance._destinationPath, queueInstanceName);
    }
  }

  async generateMiddlewares(instancePath: string, instanceName: string) {
    const instances: Array<IInstance> = this.getInstances();

    if (instances.length <= 0) {
      console.log("> No events plugin found, skipping build...");
      return;
    }

    let finalCode = ``;
    for await (const instance of instances) {
      // create a file index.js

      finalCode = finalCode.concat(
        `
    const userCustomMiddlewares = require("./middleware");\n
    const ServerSDK = require("../serverSDK");

    function createNext(serverSDK, next) {
      return next.bind(serverSDK._ctx)
    }

    module.exports.${instanceName}Middlewares = {
      // Wrap local action handlers (legacy middleware handler)
      localAction: (next, action) => {
        Object.keys(userCustomMiddlewares).forEach((key) => {
          if (action.name === key) {
            return function (ctx) {
              const serverSDK = new ServerSDK(ctx);
              const customNext = createNext(serverSDK, next);
              return userCustomMiddlewares[key](customNext, serverSDK);
            };
          }
        });
        return next;
      },
      remoteAction: (next, action) => {
        Object.keys(userCustomMiddlewares).forEach((key) => {
          if (action.name === key) {
            return function (ctx) {
              const serverSDK = new ServerSDK(ctx);
              const customNext = createNext(serverSDK, next);
              return userCustomMiddlewares[key](customNext, serverSDK);
            };
          }
        });
        return next;
      },
    };
    `
      );

      let middlewareFolderPath = join(instance._destinationPath, instanceName);

      writeFile(join(middlewareFolderPath, "index.js"), finalCode);
      // Add middlewares in moleculer.config.js

      let moleculerConfigPath = join(
        instance._destinationPath,
        "moleculer.config.js"
      );
      let moleculerConfig = await readfile(moleculerConfigPath);
      moleculerConfig = moleculerConfig.replace(
        "/* User Custom Middleware Imports */",
        `const { ${instanceName}Middlewares } = require("./middlewares");`
      );

      moleculerConfig = moleculerConfig.replace(
        "/* User Custom Middleware */",
        `${instanceName}Middlewares, /* User Custom Middleware */`
      );

      await writeFile(moleculerConfigPath, moleculerConfig);
    }
  }
}
