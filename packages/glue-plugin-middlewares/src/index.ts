// @ts-ignore
import packageJSON from "../package.json";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import { eventsTemplate } from "./helpers/template";
import { join } from "path";
import { spawnSync } from "child_process";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";

import rm from "./helpers/rm";
import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";
import { PluginInstance } from "./PluginInstance";
import { reWriteFile } from "./helpers/rewrite-file";
import { rmdir } from "fs/promises";
import copyFolder from "./helpers/copy-folder";
import { readfile } from "./helpers/readfile";

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  app: AppCLI;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);

    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    //
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

  async runPostInstall(instanceName: string, target: string) {
    const instance: IInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target
    );

    if (!instance) {
      return;
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  async writeServices(middlewaresPath: any) {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No events plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();
    let finalCode = ``;
    for await (const instance of instances) {
      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services/";
      const instanceName = instance.getName();
      const instancePath = join(
        process.cwd(),
        SEAL_SERVICES_PATH,
        instanceName,
        "src",
        instanceName
      );
      copyFolder(join(process.cwd(), middlewaresPath), instancePath, 4);
      console.log("> Copying services...");
      // create a file index.js
      let userMiddlewares = require(join(
        process.cwd(),
        middlewaresPath,
        "middleware.js"
      ));
      let instances = this.getInstances();
      instances.forEach(async (instance) => {
        finalCode = finalCode.concat(
          `
const userCustomMiddlewares = require("./middleware");\n
const ServerSDK = require("../serverSDK");

function createNext(serverSDK, next) {
  return next.bind(serverSDK._ctx)
}

module.exports.${instance.getName()}Middlewares = {
  // Wrap local action handlers (legacy middleware handler)
  localAction: (next, action) => {
    switch (action.name) {
      ${Object.keys(userMiddlewares)
        .map((key) => {
          return `case "${key}": {
          return function (ctx) {
            const serverSDK = new ServerSDK(ctx);
            const customNext = createNext(serverSDK, next);
            return userCustomMiddlewares["${key}"](customNext, serverSDK);
          };
        }
      `;
        })
        .join("")}
      default:
        return next;
    }
  }
};
`
        );

        let serviceGatewayPath = join(instancePath, "middlewares");

        if (!(await fileExists(serviceGatewayPath))) {
          spawnSync("mkdir", ["-p", serviceGatewayPath]);
        }

        writeFile(join(serviceGatewayPath, "index.js"), finalCode);
        // Add middlewares in moleculer.config.js

        let moleculerConfigPath = join(instancePath, "moleculer.config.js");
        let moleculerConfig = await readfile(moleculerConfigPath);
        moleculerConfig = moleculerConfig.replace(
          "/* User Custom Middleware Imports */",
          `const { ${instance.getName()}Middlewares } = require("./middlewares");`
        );

        moleculerConfig = moleculerConfig.replace(
          "/* User Custom Middleware */",
          `${instance.getName()}Middlewares, /* User Custom Middleware */`
        );

        let res = await writeFile(moleculerConfigPath, moleculerConfig);

        // writeFile(join(instancePath, "index.js"), "");
      });
    }
  }

  async createEventsService() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-service-gateway"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No events plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();
    for await (const instance of instances) {
      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services/";
      const instanceName = instance.getName();
      const servicePath = join(
        SEAL_SERVICES_PATH,
        instanceName,
        "src",
        instanceName,
        "services"
      );
      writeFile(servicePath, eventsTemplate());
    }
  }

  async build(): Promise<void> {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-middlewares"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No middlewares plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();
    for await (const instance of instances) {
      this.writeServices(instance.getInstallationPath());
      // this.createEventsService();
      console.log(instance.getInstallationPath());
    }
  }
}
