import {
  warning,
  success,
} from '@gluestack-v2/framework-cli/build/helpers/print';
import fs from 'fs';
// @ts-ignore
import packageJSON from '../package.json';
import { PluginInstance } from './PluginInstance';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/plugin/BaseGluestackPlugin';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';

import readfile from '@gluestack-v2/framework-cli/build/helpers/file/read-file';

import { join } from 'path';
import { fileExists, writeFile } from '@gluestack/helpers';

import path from 'path';
import writeService from './helpers/write-service';
import writeQueuesService from './helpers/write-queues-service';
import writeCronService from './helpers/write-cron-service';
import writeDbClientService from './helpers/write-db-client-service';
import { eventsTemplate } from './helpers/template';
import { writeMinioStorageService } from './helpers/writeMinioStorageService';

// Do not edit the name of this class
export class GlueStackPlugin extends BaseGluestackPlugin {
  type: 'stateless' | 'stateful' | 'devonly' = 'devonly';

  constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin) {
    super(app, gluePluginStore);
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    this.app.addEventListener('booting.web', (...args: any[]): void => {
      // eslint-disable-next-line no-console
      console.log({ message: 'booting web event listener', args });
      // eslint-disable-next-line no-console
      console.log(this.gluePluginStore.get('message'));
      this.gluePluginStore.set('message', 'Hello from function plugin');
      // eslint-disable-next-line no-console
      console.log(this.gluePluginStore.get('message'));
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

  getType(): 'stateless' | 'stateful' | 'devonly' {
    return this.type;
  }

  // getInstallationPath(target: string): string {
  //   return `./.glue/__generated__/bolt/services/${target}/src/${target}`;
  // }

  async runPostInstall(instanceName: string) {
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
      installationPath ?? ''
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }

  async generateService(
    instancePath: string,
    instanceName: string
    // ignoredPaths: string[]
  ) {
    const instances = this.getInstances();
    if (this.instances.length === 0) {
      return;
    }

    for await (const instance of instances) {
      const functionsPath = path.resolve(process.cwd(), instancePath);

      if (!(await fileExists(functionsPath))) {
        console.error('> No functions plugin found, create instance first');
      } else {
        writeService(
          instance._destinationPath,
          instancePath,
          instanceName
          // ignoredPaths
        );
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
        'package.json'
      );

      if (await fileExists(targetPkgJson)) {
        const data = await require(targetPkgJson);
        if (!data.devDependencies) {
          data.devDependencies = {};
        }
        // hard-coded the version here
        data.devDependencies['moleculer-bee-queue'] = '^0.1.10';
        const stringData = JSON.stringify(data, null, 2);
        fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added moleculer-bee-queue to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          'We could not find the package.json for service-gateway instance\n Please add moleculer-bee-queue to your service-gateway package.json\n and restart your service-gateway instance \n'
        );
      }
      writeQueuesService(instance._destinationPath, queueInstanceName);
    }
  }

  async generateMiddlewares(instancePath: string, instanceName: string) {
    const instances: Array<IInstance> = this.getInstances();

    if (instances.length <= 0) {
      console.error('> No events plugin found, skipping build...');
      return;
    }

    let finalCode = ``;
    for await (const instance of instances) {
      // create a file index.js

      finalCode = finalCode.concat(
        `
    const userCustomMiddlewares = require("./middleware");\n
    const ServerSDK = require("../Context.ts");

    function createNext(serverSDK, next) {
      return next.bind(serverSDK._ctx)
    }

    module.exports.${instanceName}Middlewares = {
      // Wrap local action handlers (legacy middleware handler)
      localAction: (next, action) => {
		    for (let key in userCustomMiddlewares) {
          if (action.name === key) {
            return function (ctx) {
              const serverSDK = new ServerSDK(ctx);
              const customNext = createNext(serverSDK, next);
              return userCustomMiddlewares[key](customNext, serverSDK);
            };
          }
        }
        return next;
      },
      remoteAction: (next, action) => {
		    for (let key in userCustomMiddlewares) {
          if (action.name === key) {
            return function (ctx) {
              const serverSDK = new ServerSDK(ctx);
              const customNext = createNext(serverSDK, next);
              return userCustomMiddlewares[key](customNext, serverSDK);
            };
          }
        }
        return next;
      },
    };
    `
      );

      const middlewareFolderPath = join(
        instance._destinationPath,
        instanceName
      );

      writeFile(join(middlewareFolderPath, 'index.js'), finalCode);
      // Add middlewares in moleculer.config.js

      const moleculerConfigPath = join(
        instance._destinationPath,
        'moleculer.config.js'
      );
      let moleculerConfig = await readfile(moleculerConfigPath);
      moleculerConfig = moleculerConfig.replace(
        '/* User Custom Middleware Imports */',
        `const { ${instanceName}Middlewares } = require("./middlewares");`
      );

      moleculerConfig = moleculerConfig.replace(
        '/* User Custom Middleware */',
        `${instanceName}Middlewares, /* User Custom Middleware */`
      );

      await writeFile(moleculerConfigPath, moleculerConfig);
    }
  }
  async generateCrons(cronInstancePath: string, cronInstanceName: string) {
    const instances = this.getInstances();
    if (instances.length <= 0) {
      console.error('> No functions plugin found, skipping build');
      return;
    }

    instances.forEach(async (instance) => {
      const targetPkgJson: string = join(
        instance._destinationPath,
        'package.json'
      );
      if (await fileExists(targetPkgJson)) {
        let data: any = await readfile(targetPkgJson);

        data = JSON.parse(data);
        if (!data.devDependencies) {
          data.devDependencies = {};
        }
        data.devDependencies['moleculer-cron'] = 'latest';
        data.devDependencies.axios = 'latest';
        const stringData = JSON.stringify(data, null, 2);
        await fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added moleculer-cron to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          'We could not find the package.json for service-gateway instance\n Please add moleculer-cron to your service-gateway package.json\n and restart your service-gateway instance \n'
        );
      }

      await writeCronService(
        cronInstancePath,
        instance._destinationPath,
        cronInstanceName
      );
    });
  }

  async generateEventsService() {
    const instances = this.getInstances();

    if (instances.length <= 0) {
      console.error('> No functions plugin found, skipping build');
      return;
    }

    instances.forEach(async (instance) => {
      const destination = join(
        instance._destinationPath,
        'services',
        'events.service.js'
      );
      writeFile(destination, eventsTemplate());
    });
  }

  async generateDbClientService(cronInstanceName: string) {
    const instances = this.getInstances();
    if (instances.length <= 0) {
      console.error('> No service gateway plugin found, skipping...');
      return;
    }

    instances.forEach(async (instance) => {
      const targetPkgJson: string = join(
        instance._destinationPath,
        'package.json'
      );
      if (await fileExists(targetPkgJson)) {
        const data: any = await readfile(targetPkgJson);

        // data = data;
        if (!data.dependencies) {
          data.dependencies = {};
        }
        data.dependencies.prisma = 'latest';
        data.dependencies['@prisma/client'] = 'latest';
        const stringData = JSON.stringify(data, null, 2);
        await fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added prisma & @prisma/client to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          'We could not find the package.json for service-gateway instance\n Please add prisma & @prisma/client to your service-gateway package.json\n and restart your service-gateway instance \n'
        );
      }

      await writeDbClientService(instance._destinationPath, cronInstanceName);
    });
  }

  async generateStorageClientService(storageClientInstanceName: string) {
    if (this.instances.length === 0) {
      return;
    }
    const plugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-storage'
    ) as IPlugin;

    const storageInstances = plugin.getInstances();
    const instances = this.getInstances();
    for await (const instance of instances) {
      const targetPkgJson: string = join(
        instance._destinationPath,
        'package.json'
      );

      if (await fileExists(targetPkgJson)) {
        const data = await require(targetPkgJson);
        if (!data.devDependencies) {
          data.devDependencies = {};
        }
        // hard-coded the version here
        data.devDependencies.minio = 'latest';
        const stringData = JSON.stringify(data, null, 2);
        fs.writeFileSync(targetPkgJson, stringData);
        success(
          "We have added minio to your service-gateway package.json\n Please run 'npm install' to install the package\n and restart your service-gateway instance \n"
        );
      } else {
        warning(
          'We could not find the package.json for service-gateway instance\n Please add minio to your service-gateway package.json\n and restart your service-gateway instance \n'
        );
      }

      writeMinioStorageService(
        instance._destinationPath,
        storageClientInstanceName,
        storageInstances[0]
      );
    }
  }
}
