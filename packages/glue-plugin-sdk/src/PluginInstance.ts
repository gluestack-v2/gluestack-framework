import { join } from 'path';
import {
  AppCLI,
  BaseGluestackPluginInstance,
} from '@gluestack-v2/framework-cli';
import type { IPlugin, IGlueStorePlugin } from '@gluestack-v2/framework-cli';
import fs from 'fs';
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

  async createPackageByName(name: string, configName: string) {
    const packagePath = await this.app.createPackage(
      name,
      join(this.callerPlugin.getPackagePath(), 'sdk')
    );

    await this.app.replaceTemplateValues(
      join(packagePath, 'src', 'index.ts'),
      'UPDATECONFIGTYPE',
      configName
    );
    return packagePath;
  }

  async build() {
    const clientSDKPath = await this.createPackageByName(
      'client-sdk',
      'client-config'
    );

    const serverSDKPath = await this.createPackageByName(
      'server-sdk',
      'server-config'
    );

    await this.app.replaceTemplateValues(
      join(clientSDKPath, 'src', 'index.ts'),
      '/*** UPDATE_ENV_BASED_ON_ENVIRONMENT ***/',
      `= ${JSON.stringify(await this.filterEnvData(dotEnvPath, 'client'))}`
    );
    await this.app.replaceTemplateValues(
      join(serverSDKPath, 'src', 'index.ts'),
      '// Add imports here',
      `import dotenv from 'dotenv'; \nimport findWorkspaceRoot from 'find-yarn-workspace-root'; \nimport { join } from 'path'; \n// Add imports here\n\nconst workspaceRoot: any = findWorkspaceRoot(__dirname); \ndotenv.config({\tpath: join(workspaceRoot, '.env')\n\t});\n`
    );
    await this.app.replaceTemplateValues(
      join(serverSDKPath, 'src', 'index.ts'),
      '/*** UPDATE_ENV_BASED_ON_ENVIRONMENT ***/',
      `= process.env`
    );
    await this.app.replaceTemplateValues(
      join(serverSDKPath, 'src', 'index.ts'),
      'PROJECT_PATH_ENV',
      'server-config'
    );
    this.generateConfigInServiceSdk(clientSDKPath, serverSDKPath);
  }

  generateConfigInServiceSdk(clientSDKPath: string, serverSDKPath: string) {
    const developPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-develop'
    );

    if (developPlugin) {
      // @ts-ignore
      const configPath = developPlugin.getConfigPath();

      const clientConfig = fs.readFileSync(
        join(configPath, 'client.ts'),
        'utf-8'
      );
      const serverConfig = fs.readFileSync(
        join(configPath, 'server.ts'),
        'utf-8'
      );
      const globalConfig = fs.readFileSync(
        join(configPath, 'index.ts'),
        'utf-8'
      );
      this.addConfigAlias(clientConfig, clientSDKPath);
      this.addConfigAlias(serverConfig, serverSDKPath);
      this.addConfigAlias(globalConfig, [clientSDKPath, serverSDKPath]);
    }
  }

  addConfigAlias(config: string, path: string | Array<string>) {
    const regex = /{[\s\S]*providers\s*:\s*{\s*([\s\S]+)\s*},[\s\S]*}/;
    const match = config.match(regex);
    if (match && match[0]) {
      const configMap = JSON.parse(JSON.stringify(match[0]));
      const configKeys = this.extractProviderKeys(configMap);
      configKeys.map(async (provider: string) => {
        if (!(provider === 'providers')) {
          if (typeof path === 'string') {
            await this.addProviderAliasInSdk(provider, path);
          } else {
            path.map(async (p: string) => {
              await this.addProviderAliasInSdk(provider, p);
            });
          }
        }
      });
    }
  }

  extractProviderKeys(providerString: string) {
    const regex = /\s*([\w$]+)\s*:/g;
    const keys = [];
    let match;
    while ((match = regex.exec(providerString))) {
      keys.push(match[1]);
    }
    return keys;
  }

  addProviderAliasInSdk(providerName: string, packagePath: string) {
    const getterTemplate = `	get ${providerName}() {
		return this.providers.get('${providerName}');
	  }`;
    this.updateTemplate(
      join(packagePath, 'src', 'sdk.ts'),
      getterTemplate,
      '// **** Add getter functions after this comment ****'
    );
  }

  updateTemplate(
    filePath: string,
    replacementTemplate: string,
    sdkTemplateString: string
  ) {
    const data = fs.readFileSync(filePath, 'utf8');

    const commentIndex = data.indexOf(sdkTemplateString);
    if (commentIndex === -1) {
      console.error('Comment not found in the file.');
      return;
    }

    if (data.includes(replacementTemplate)) {
      return;
    }
    // Insert the string after the comment
    const updatedContent =
      data.slice(0, commentIndex + sdkTemplateString.length) +
      '\n' +
      '\n' +
      replacementTemplate +
      data.slice(commentIndex + sdkTemplateString.length);

    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }

  async watch(callback?: Function) {
    // NO NEED TO WATCH
    const developPlugin = this.app.getPluginByName(
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
