// @ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import BaseGluestackPlugin from "@gluestack-v2/framework-cli/build/types/gluestack-plugin";

import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";

import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

import path, { join } from "path";

import copyFile from "./helpers/copy-file";
import writeFile from "./helpers/write-file";
import { reWriteFile } from "./helpers/rewrite-file";
import { removeSpecialChars, Workspaces } from "@gluestack/helpers";
import fileExists from "./helpers/file-exists";
import rm from "./helpers/rm";
import copyFolder from "./helpers/copy-folder";
import { spawnSync } from "child_process";

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

    // update package.json'S name index with the new instance name
    const pluginPackage = `${instance.getInstallationPath()}/package.json`;
    await reWriteFile(pluginPackage, instanceName, "INSTANCENAME");

    // update root package.json's workspaces with the new instance name
    const rootPackage: string = `${process.cwd()}/package.json`;
    await Workspaces.append(rootPackage, instance.getInstallationPath());

    // // move seal.service.yaml into the new instance
    // await reWriteFile(
    //   `${instance.getSealServicefile()}`,
    //   instanceName,
    //   "INSTANCENAME"
    // );

    // // move dockerfile into the new instance
    // if (instance.getDockerfile) {
    //   await reWriteFile(
    //     `${instance?.getDockerfile()}`,
    //     instanceName,
    //     "INSTANCENAME"
    //   );
    // }
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
  testFunction() {
    console.log("test");
  }
  getInstances(): IInstance[] {
    return this.instances;
  }

  sealInit(SEAL_SERVICES_PATH: string, name: string) {
    // seal init and seal service add in the services folder
    const sealInit = spawnSync("sh", [
      "-c",
      `cd ${SEAL_SERVICES_PATH} && seal init`,
    ]);

    if (sealInit.status !== 0) {
      console.error(`Command failed with code ${sealInit.status}`);
    }
    console.log(sealInit.stdout.toString());
    console.error(sealInit.stderr.toString());

    const sealAddService = spawnSync("sh", [
      "-c",
      `cd ${SEAL_SERVICES_PATH} && seal service:add ${name} ./${name}/src`,
    ]);

    if (sealAddService.status !== 0) {
      console.error(`Command failed with code ${sealAddService.status}`);
    }
    console.log(sealAddService.stdout.toString());
    console.error(sealAddService.stderr.toString());
  }

  // async watchFolders(src: any, dest: any) {
  //   chokidar.watch(".").on("all", (event, path) => {
  //     console.log(event, path);
  //   });
  //   // const watcher = chokidar.watch("file, dir, glob, or array", {
  //   //   ignored: /(^|[\/\\])\../, // ignore dotfiles
  //   //   persistent: true,
  //   // });

  //   // // Something to use when events are received.
  //   // const log = console.log.bind(console);
  //   // // Add event listeners.
  //   // watcher
  //   //   .on("add", (path) => log(`File ${path} has been added`))
  //   //   .on("change", (path) => log(`File ${path} has been changed`))
  //   //   .on("unlink", (path) => log(`File ${path} has been removed`));

  //   // // More possible events.
  //   // watcher
  //   //   .on("addDir", (path) => log(`Directory ${path} has been added`))
  //   //   .on("unlinkDir", (path) => log(`Directory ${path} has been removed`))
  //   //   .on("error", (error) => log(`Watcher error: ${error}`))
  //   //   .on("ready", () => log("Initial scan complete. Ready for changes"))
  //   //   .on("raw", (event, path, details) => {
  //   //     // internal
  //   //     log("Raw event info:", event, path, details);
  //   //   });
  // }

  getGeneratedPath(name: any) {
    const generatedPkgPath = path.join(
      process.cwd(),
      ".glue",
      "__generated__",
      "packages"
    );
    return path.join(
      process.cwd(),
      ".glue",
      "__generated__",
      "seal",
      "services",
      name,
      "src"
    );
  }

  async build(): Promise<void> {
    // let instanceMap: any = {};
    // this.app.getPlugins().map((p) =>
    //   p.getInstances().map((i) => {
    //     if (instanceMap[i.getCallerPlugin().getName()]) {
    //       instanceMap[i.getCallerPlugin().getName()].push({
    //         path: i.getInstallationPath(),
    //         pluginName: i.getCallerPlugin().getName(),
    //         instanceName: i.getName(),
    //       });
    //     } else {
    //       instanceMap[i.getCallerPlugin().getName()] = [];
    //       instanceMap[i.getCallerPlugin().getName()].push({
    //         path: i.getInstallationPath(),
    //         pluginName: i.getCallerPlugin().getName(),
    //         instanceName: i.getName(),
    //       });
    //     }
    //   })
    // );

    // Copy packages folder to seal services
    // const generatedServices = fs.readdirSync(generatedWebPath);
    // for (const service of generatedServices) {

    // }

    // End Copy packages folder to seal services

    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-web"
    );

    if (!plugin || plugin.getInstances().length <= 0) {
      console.log("> No web plugin found, skipping build...");
      return;
    }

    const instances: Array<IInstance> = plugin.getInstances();

    for await (const instance of instances) {
      const source: string = instance.getInstallationPath();
      const name: string = removeSpecialChars(instance.getName());
      const copyPkgPath = this.getGeneratedPath(name);

      // if (instanceMap?.["@gluestack-v2/glue-plugin-service-sdk"]) {
      //   for (const sdk of instanceMap?.[
      //     "@gluestack-v2/glue-plugin-service-sdk"
      //   ]) {
      //     let generatedWebPath = "";
      //     generatedWebPath = path.join(process.cwd(), sdk.path);
      if (await fileExists(path.join(copyPkgPath))) {
        console.log("Removing " + path.join(copyPkgPath));

        rm(path.join(copyPkgPath));
      }

      // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
      await this.app.write(source, name);

      await this.app.updateServices();

      /**
       * @TODO:
       * 1. move below code to the glue-plugin-seal or something
       * 2. seal.service.yaml, dockerfile & package.json movement
       *    into .glue/seal/services/<instance-name>/src
       */
      const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services";
      const destination: string = join(
        process.cwd(),
        SEAL_SERVICES_PATH,
        name,
        "src"
      );

      // move seal.service.yaml
      // await copyFile(
      //   instance.getSealServicefile(),
      //   join(destination, "seal.service.yaml")
      // );

      // // move dockerfile, if exists
      // if (instance.getDockerfile) {
      //   await copyFile(
      //     instance?.getDockerfile(),
      //     join(destination, "Dockerfile")
      //   );
      // }

      // add package.json with workspaces
      const packageFile: string = join(destination, "package.json");
      const packageContent: any = {
        name: name,
        private: true,
        workspaces: [name, "packages/**/src"],
        scripts: {
          "install-all": "npm install --workspaces --if-present",
          dev: "npm run dev --workspace @project/" + name,
        },
      };
      await writeFile(packageFile, JSON.stringify(packageContent, null, 2));

      this.sealInit(SEAL_SERVICES_PATH, name);
    }
  }
}
