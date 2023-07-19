import { join } from 'path';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';

import { GLUE_GENERATED_PACKAGES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

const dotEnvPath = join(process.cwd(), '.env');

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

  getDestinationPath(): string {
    return join(
      process.cwd(),
      '.glue',
      '__generated__',
      'packages',
      this.getName()
    );
  }

  async build() {
    await this.app.createPackage(
      'client-sdk',
      join(this.callerPlugin.getPackagePath(), 'sdk')
    );

    await this.app.createPackage(
      'server-sdk',
      join(this.callerPlugin.getPackagePath(), 'sdk')
    );

    const clientSDKPath = join(
      GLUE_GENERATED_PACKAGES_PATH,
      'client-sdk',
      'src',
      'index.ts'
    );
    const serverSDKPath = join(
      GLUE_GENERATED_PACKAGES_PATH,
      'server-sdk',
      'src',
      'index.ts'
    );

    this.app.replaceTemplateValues(
      clientSDKPath,
      'UPDATECONFIGTYPE',
      'client-config'
    );
    this.app.replaceTemplateValues(
      serverSDKPath,
      'UPDATECONFIGTYPE',
      'server-config'
    );
    this.app.replaceTemplateValues(
      clientSDKPath,
      '/*** UPDATE_ENV_BASED_ON_ENVIRONMENT ***/',
      `= ${JSON.stringify(await this.filterEnvData(dotEnvPath, 'client'))}`
    );
    this.app.replaceTemplateValues(
      serverSDKPath,
      '// Add imports here',
      `import dotenv from 'dotenv'; \nimport findWorkspaceRoot from 'find-yarn-workspace-root'; \nimport { join } from 'path'; \n// Add imports here\n\nconst workspaceRoot = findWorkspaceRoot(__dirname); \ndotenv.config({\tpath: join(workspaceRoot, '.env')\n\t});\n`
    );
    this.app.replaceTemplateValues(
      serverSDKPath,
      '/*** UPDATE_ENV_BASED_ON_ENVIRONMENT ***/',
      `= process.env`
    );
    this.app.replaceTemplateValues(
      serverSDKPath,
      'PROJECT_PATH_ENV',
      'server-config'
    );
  }

  async watch(callback?: Function) {
    // NO NEED TO WATCH
    let developPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-develop'
    );
    await this.buildBeforeWatch();
    // @ts-ignore
    this.app.watch(developPlugin.getConfigPath(), '', async (events, path) => {
      if (developPlugin) {
        // Watching for changes in config
        // @ts-ignore
        await developPlugin.createConfigPackage(
          'server',
          // @ts-ignore
          developPlugin.getConfigPath(),
          // @ts-ignore
          developPlugin.getGeneratedConfigPath('server')
        );
        // @ts-ignore
        await developPlugin.createConfigPackage(
          'client',
          // @ts-ignore
          developPlugin.getConfigPath(),
          // @ts-ignore
          developPlugin.getGeneratedConfigPath('client')
        );
      }
      if (callback) {
        callback(events, path);
      }
      await this.app.updateServices();
    });

    this.app.watch(dotEnvPath, '', async (events, path) => {
      if (this) {
        await this.build();
      }
      if (callback) {
        callback(events, path);
      }
      await this.app.updateServices();
    });

    // COPY THIS SECTION of code for any other plugin instace watch

    // this.app.watch(
    //   this._sourcePath,
    //   this._destinationPath,
    //   async (event, path) => {
    //     // TODO: OPTIMIZE UPDATES
    //     // this.app.updateServices();
    //   }
    // );
  }
}
