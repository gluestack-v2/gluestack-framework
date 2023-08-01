import { join } from 'path';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPluginInstance';
import fs, { copyFileSync } from 'fs';

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
    await this.getConfigInServiceSdk(clientSDKPath, 'client');
    this.generateConfigInServiceSdk(clientSDKPath, serverSDKPath);
  }

  getConfigInServiceSdk(clientSDKPath: string, configType: string) {
    const configPath = join(process.cwd(), 'config', `${configType}.ts`);
    copyFileSync(configPath, join(clientSDKPath, 'src', `${configType}.ts`));
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
      this.addConfigAlias(globalConfig, clientSDKPath);
      this.addConfigAlias(globalConfig, serverSDKPath);
    }
  }

  addConfigAlias(config: string, path: string) {
    const regex = /{[\s\S]*providers\s*:\s*{\s*([\s\S]+)\s*},[\s\S]*}/;
    const match = config.match(regex);
    const singleLineCommentRegex = /\/\/.*(?:\r?\n|$)/g;
    const stringWithoutSingleLineComments = config.replace(
      singleLineCommentRegex,
      ''
    );

    // Regular expression to remove multiline comments
    const multiLineCommentRegex = /\/\*[\s\S]*?\*\//g;
    const stringWithoutComments = stringWithoutSingleLineComments.replace(
      multiLineCommentRegex,
      ''
    );
    if (match && match[0]) {
      // const configMap = JSON.parse(JSON.stringify(match[0]));
      // const configKeys = this.extractProviderKeys(configMap);

      const providers = this.getProvidersFromConfig(stringWithoutComments);
      this.addProviderAliasInSdk(path, providers, stringWithoutComments);
      // configKeys.map(async (provider: string) => {
      //   if (!(provider === 'providers')) {
      //     await this.addProviderAliasInSdk(provider, path, config);
      //   }
      // });
    }
  }

  addProviderAliasInSdk(packagePath: string, providers: any, config: string) {
    Object.keys(providers).map(async (providerName: string) => {
      const getterTemplate = `	get ${providerName}(): ReturnType<${providers[providerName]}['getProvider']> | undefined {
    return this.providers.get('${providerName}').getProvider();
    }`;
      this.updateTemplate(
        join(packagePath, 'src', 'sdk.ts'),
        getterTemplate,
        '// **** Add getter functions after this comment ****',
        config
      );
    });
  }

  getProvidersFromConfig(config: string) {
    // Regular expression to match the providers object content
    const providersRegex = /providers:\s*{([\s\S]*?)},/;

    // Find the providers content using regex
    const match = config.match(providersRegex);

    if (match) {
      const providersContent = match[1];

      // Function to parse providersContent into a JavaScript object
      const parseProvidersObject = (str: any) => {
        const keyValuePairsRegex = /\s*([\w$]+)\s*:\s*([\w$]+)\s*,?/g;
        const providersObject: any = {};
        let kvMatch;

        while ((kvMatch = keyValuePairsRegex.exec(str))) {
          const key = kvMatch[1];
          const value = kvMatch[2];

          // Check if the line is commented
          const commentRegex = new RegExp(`\\s*//.*${key}\\s*:`);
          if (commentRegex.test(str.substring(0, kvMatch.index))) {
            continue; // Ignore commented lines
          }

          providersObject[key] = value;
        }

        return providersObject;
      };

      // Convert providersContent into a JavaScript object
      const providersObject = parseProvidersObject(providersContent);

      return providersObject;
    } else {
      console.error('Providers object not found in the given string.');
    }
  }

  extractImports(jsString: string) {
    const importRegex = /import\s+([\w{},\s*]+)\s+from\s+['"](.+?)['"]/g;

    // Array to store the matched imports
    const imports = [];

    let match;
    while ((match = importRegex.exec(jsString)) !== null) {
      const importedNames = match[1].split(',').map((name) => name.trim());
      const fromModule = match[2];
      imports.push({ importedNames, fromModule });
    }
    return imports;
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

  updateTemplate(
    filePath: string,
    replacementTemplate: string,
    sdkTemplateString: string,
    config: string
  ) {
    const data = fs.readFileSync(filePath, 'utf8');
    const imports = this.extractImports(config);
    let finalImports = ``;
    imports.map((val: any) => {
      if (
        !finalImports.includes(
          `import ${val.importedNames} from '${val.fromModule}';`
        ) &&
        !data.includes(`import ${val.importedNames} from '${val.fromModule}';`)
      )
        finalImports += `import ${val.importedNames} from '${val.fromModule}';\n`;
    });

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

    fs.writeFileSync(filePath, finalImports + updatedContent, 'utf8');
  }

  async watch(callback?: Function) {
    // NO NEED TO WATCH
    const developPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-develop'
    );
    await this.buildBeforeWatch();

    // @ts-ignore
    this.app.watch(developPlugin.getConfigPath(), '', async (events, path) => {
      this.build();
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
        if (events === 'change') {
          await this.buildPackage(
            // @ts-ignore
            developPlugin.getGeneratedConfigPath('client')
          );
          await this.buildPackage(
            // @ts-ignore
            developPlugin.getGeneratedConfigPath('server')
          );
          await this.buildPackage(
            this.app.getGeneratedPackagePath('client-sdk')
          );
          await this.buildPackage(
            this.app.getGeneratedPackagePath('server-sdk')
          );
        }
      }
      if (callback) {
        callback(events, path);
      }
      // await this.app.updateServices();
    });

    this.app.watch(dotEnvPath, '', async (events, path) => {
      if (this) {
        await this.build();
      }
      if (callback) {
        callback(events, path);
      }
      // await this.app.updateServices();
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
