import { join } from "path";
import { removeSpecialChars } from "@gluestack/helpers";

import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import IPlugin from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import IGlueStorePlugin from "@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore";
import BaseGluestackPluginInstance from "@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

import writeFile from "./helpers/write-file";
import fileExists from "./helpers/file-exists";

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
    return `${this.getInstallationPath()}/Dockerfile`;
  }

  getSealServicefile(): string {
    return `${this.getInstallationPath()}/seal.service.yaml`;
  }

  async build () {
    const source: string = this.getInstallationPath();
    const name: string = removeSpecialChars(this.getName());

    // moves the instance into .glue/seal/services/<instance-name>/src/<instance-name>
    await this.app.write(source, name);

    await this.app.updateServices();

    /**
     * @TODO:
     * 1. move below code to the glue-plugin-seal or something
     * 2. seal.service.yaml, dockerfile & package.json movement
     *    into .glue/seal/services/<instance-name>/src
     */
    const SEAL_SERVICES_PATH: string = GLUE_GENERATED_SEAL_SERVICES_PATH;
    const destination: string = join(
      process.cwd(),
      SEAL_SERVICES_PATH,
      name,
      "src"
    );

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

    // await this.sealInit(SEAL_SERVICES_PATH, name);
  }

  async watch(callback: Function): Promise<void> {
    if (!await fileExists(this.getGeneratedPath(this.getName()))) {
      try {
        await this.build();
      } catch (error) {
        console.log('>> Instance does not exits:', this.getName());
        return;
      }
    }

    const sourcePath = this.getSourcePath();
    const destinationPath = this.getDestinationPath();

    this.app.watch(
      sourcePath,
      destinationPath,
      async (event, path) => callback(event, path)
    );
  }
}
