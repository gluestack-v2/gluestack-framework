import type {
  IPlugin,
  IInstance,
  IGlueStorePlugin,
} from '@gluestack-v2/framework-cli';
import {
  AppCLI,
  BaseGluestackPluginInstance,
  GLUE_GENERATED_PACKAGES_PATH,
  GLUE_GENERATED_SERVICES_PATH,
} from '@gluestack-v2/framework-cli';
import { join } from 'path';
import writeSDK from './helpers/write-sdk';
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

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getIgnoredPaths(): string[] {
    return ['middlewares', 'events', 'private'];
  }

  async watch(callback?: Function): Promise<void> {
    await this.buildBeforeWatch();

    this.app.watch(
      this._sourcePath,
      this._destinationPath,
      async (event, path) => {
        // TODO: OPTIMIZE UPDATES

        this.generateFunctionsInServiceGateway();
        // this.generateFunctionsInServiceSdk(this.getIgnoredPaths());

        if (callback) {
          callback(event, path);
        }
      }
    );
  }

  getSourcePath(): string {
    return join(process.cwd(), this.getPluginEnvironment(), this.getName());
  }

  getPluginEnvironment() {
    // @ts-ignore
    return this.callerPlugin.getPluginEnvironment();
  }

  generateFunctionsInServiceGateway() {
    const name = this.getName();
    const installationPath = this._destinationPath;

    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    ) as IPlugin;
    // @ts-ignore
    plugin.generateService(installationPath, name);
  }

  generateFunctionsInServiceSdk(ignoredPaths: any) {
    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-sdk'
    ) as IPlugin;

    // @ts-ignore
    plugin.generateSDK(this._sourcePath, this.getName(), ignoredPaths);
  }

  async createClientSDKPackage() {
    const clientSdkPackageName: string = `${this.getName()}-client-sdk`;
    const packagePath = join(
      GLUE_GENERATED_PACKAGES_PATH,
      clientSdkPackageName
    );

    const sdkPath = join(this.callerPlugin.getPackagePath(), 'sdk', 'client');
    await this.app.createPackage(clientSdkPackageName, sdkPath);

    await writeSDK(packagePath, this._sourcePath, sdkPath, [], this.getName());
    await this.app.updateNameInPackageJSON(packagePath, clientSdkPackageName);
  }

  async build() {
    await this.app.write(this._sourcePath, this._destinationPath);
    // @ts-ignore
    this.generateFunctionsInServiceGateway();
    this.createClientSDKPackage();

    // this.generateFunctionsInServiceSdk(this.getIgnoredPaths());
  }

  getGatewayInstanceInfo() {
    const plugin: IPlugin | null = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    if (!plugin) {
      console.error(
        `Plugin "@gluestack-v2/glue-plugin-service-gateway" not found.`
      );
      return '';
    }

    const instances: Array<IInstance> | undefined = plugin.instances;
    if (!instances || instances.length <= 0) {
      console.error(
        `No instance with "@gluestack-v2/glue-plugin-service-gateway" found.`
      );
      return '';
    }

    return instances[0].getName();
  }
  // Override getDestinationPath
  getDestinationPath() {
    const gatewayInstanceName: string = this.getGatewayInstanceInfo();

    return join(
      process.cwd(),
      GLUE_GENERATED_SERVICES_PATH,
      gatewayInstanceName,
      'src',
      gatewayInstanceName,
      this.getName()
    );
  }
}
