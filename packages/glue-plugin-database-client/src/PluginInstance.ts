import { join, resolve } from 'path';
import { spawn } from 'child_process';

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
import BaseGluestackPluginInstance from '@gluestack-v2/framework-cli/build/types/BaseGluestackPluginInstance';
import { GLUE_GENERATED_BOLT_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';

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
    return join(process.cwd(), 'server', this.getName());
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

  getDestinationPath(): string {
    const gatewayInstanceName: string = this.getGatewayInstanceInfo();
    return join(
      process.cwd(),
      GLUE_GENERATED_BOLT_SERVICES_PATH,
      gatewayInstanceName,
      'src',
      gatewayInstanceName,
      this.getName()
    );
  }

  async dbCommandService(
    instanceDestinationPath: string,
    subCommand: any
  ): Promise<void> {
    const allOptions = subCommand.opts.slice(2);

    // eslint-disable-next-line no-console
    console.log(
      [
        'prisma',
        subCommand.type,
        '--schema=' + join('.', this.getName(), 'schema.prisma'),
        ...allOptions,
      ].join(' ')
    );
    spawn('npm', ['run', 'install:all'], {
      cwd: resolve(instanceDestinationPath, '..'),
    })
      .on('close', () => {
        // eslint-disable-next-line no-console
        console.log('npm installed');
        spawn(
          'npx',
          [
            'prisma',
            subCommand.type,
            '--schema=' + join('.', this.getName(), 'schema.prisma'),
            ...allOptions,
          ],
          {
            // @ts-ignore
            cwd: join(instanceDestinationPath),
          }
        )
          .on('close', () => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate generated');
          })
          .on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate error', err);
          })
          .on('exit', (code) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate exit', code);
          })
          .on('message', (message) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate message', message);
          });
      })
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log('npm install error', err);
      })
      .on('exit', (code) => {
        // eslint-disable-next-line no-console
        console.log('npm install exit', code);
      })
      .on('message', (message) => {
        // eslint-disable-next-line no-console
        console.log('npm install message', message);
      });
  }

  async migrateDbClientService(
    instanceDestinationPath: string,
    subCommand: any
  ): Promise<void> {
    const allOptions = subCommand.opts.slice(2);
    // eslint-disable-next-line no-console
    console.log(
      [
        'prisma',
        'migrate',
        subCommand.type,
        '--schema=' + join('.', this.getName(), 'schema.prisma'),
        ...allOptions,
      ].join(' ')
    );
    spawn('npm', ['run', 'install:all'], {
      cwd: resolve(instanceDestinationPath, '..'),
    })
      .on('close', () => {
        // eslint-disable-next-line no-console
        console.log('npm installed');
        spawn(
          'npx',
          [
            'prisma',
            'migrate',
            subCommand.type,
            '--schema=' + join('.', this.getName(), 'schema.prisma'),
            ...allOptions,
          ],
          {
            // @ts-ignore
            cwd: join(instanceDestinationPath),
          }
        )
          .on('close', () => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate generated');
          })
          .on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate error', err);
          })
          .on('exit', (code) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate exit', code);
          })
          .on('message', (message) => {
            // eslint-disable-next-line no-console
            console.log('Prisma migrate message', message);
          });
      })
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log('npm install error', err);
      })
      .on('exit', (code) => {
        // eslint-disable-next-line no-console
        console.log('npm install exit', code);
      })
      .on('message', (message) => {
        // eslint-disable-next-line no-console
        console.log('npm install message', message);
      });
  }

  async generateDbClientService(
    instanceDestinationPath: string
  ): Promise<void> {
    spawn('npm', ['run', 'install:all'], {
      cwd: resolve(instanceDestinationPath, '..'),
    })
      .on('close', () => {
        // eslint-disable-next-line no-console
        console.log('npm installed');
        spawn(
          'npx',
          [
            'prisma',
            'generate',
            '--schema=' + join('.', this.getName(), 'schema.prisma'),
          ],
          {
            // @ts-ignore
            cwd: join(instanceDestinationPath),
          }
        )
          .on('close', () => {
            // eslint-disable-next-line no-console
            console.log('Prisma generated');
            // const sdkPlugin = this.app.getPluginByName(
            //   '@gluestack-v2/glue-plugin-service-sdk'
            // );
            // const functionsPlugin = this.app.getPluginByName(
            //   '@gluestack-v2/glue-plugin-functions'
            // );
            // const functionsInstance = functionsPlugin?.getInstances();
            // functionsInstance?.forEach((instance) => {
            //   // @ts-ignore
            //   sdkPlugin.generateClientSDK(instance._sourcePath, []);
            // });
          })
          .on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('Prisma generate error', err);
          })
          .on('exit', (code) => {
            // eslint-disable-next-line no-console
            console.log('Prisma generate exit', code);
          })
          .on('message', (message) => {
            // eslint-disable-next-line no-console
            console.log('Prisma generate message', message);
          });
      })
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log('npm install error', err);
      })
      .on('exit', (code) => {
        // eslint-disable-next-line no-console
        console.log('npm install exit', code);
      })
      .on('message', (message) => {
        // eslint-disable-next-line no-console
        console.log('npm install message', message);
      });
  }

  async build(): Promise<void> {
    // moves the instance into .glue/bolt/services/<instance-name>/src/<instance-name>
    const gatewayPlugin = this.app.getPluginByName(
      '@gluestack-v2/glue-plugin-service-gateway'
    );

    const gatewayInstance = gatewayPlugin?.getInstances()[0];

    if (!gatewayInstance) {
      throw new Error('Gateway instance not found');
    }

    this.app.write(
      this._sourcePath,
      join(gatewayInstance._destinationPath, this.getName())
    );

    this.generateDbClientService(gatewayInstance._destinationPath);
    // @ts-ignore
    await gatewayPlugin.generateDbClientService(this.getName());

    const sdkPath = join(this.callerPlugin.getPackagePath(), 'sdk');
    await this.app.createPackage(
      `${this.getName()}-client-sdk`,
      join(sdkPath, 'client')
    );

    await this.app.createPackage(
      `${this.getName()}-server-sdk`,
      join(sdkPath, 'server')
    );
  }

  async watch(): Promise<void> {
    await this.buildBeforeWatch();

    this.app.watch(this._sourcePath, this._destinationPath, () => {
      //
    });
  }
}
