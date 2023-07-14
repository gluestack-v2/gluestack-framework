import { success } from '@gluestack-v2/framework-cli/build/helpers/print';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import {
  RunningPlatforms,
  RunningPlatform,
} from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';

import { executeMultipleTerminals } from '../../helpers/execute-multiple-terminals';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { execute } from '../../helpers/execute';

const upSealService = async (
  app: AppCLI,
  instance: IInstance,
  runningPlatforms: RunningPlatforms,
  platform: RunningPlatform,
  verbose: boolean = false
) => {
  const serviceName: string = instance.getName();

  let servicePlatform = platform;
  //TODO: refactor-later
  if (!runningPlatforms.includes(platform)) {
    // run in any platform in case option provided in not available in plugin's runningPlatforms
    servicePlatform = runningPlatforms[0];
  }

  // build all packages
  console.log(serviceName, servicePlatform);
  executeMultipleTerminals(
    'sh',
    [
      '-c',
      `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && bolt service:up ${serviceName} --service-runner ${servicePlatform}`,
    ],
    { stdio: 'inherit' }
  );

  // bolt up all services

  // executeMultipleTerminals(
  //   'sh',
  //   [
  //     '-c',
  //     `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && bolt service:up ${serviceName} --service-runner ${servicePlatform}`,
  //   ],
  //   { stdio: 'inherit' }
  // );

  //TODO: remove later
  // for continuous logging output
  if (verbose) {
    // execute(
    //   'sh',
    //   [
    //     '-c',
    //     `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && tail -f .logs/${serviceName}/out.log`,
    //   ],
    //   { stdio: 'inherit' }
    // );

    // for continuous error logging output
    execute(
      'sh',
      [
        '-c',
        `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && tail -f .logs/${serviceName}/err.log && .logs/${serviceName}/out.log`,
      ],
      { stdio: 'inherit' }
    );
  }
};

export default async (app: AppCLI, opts: any): Promise<void> => {
  for await (const plugin of app.plugins) {
    for (const instance of plugin.instances) {
      success(
        `Seal service plugin instance found!`,
        `${plugin.getName()}:: ${instance.getName()}`
      );

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {
        if (plugin.getName() === '@gluestack-v2/glue-plugin-graphql') {
          setTimeout(async () => {
            await upSealService(
              app,
              instance,
              plugin.runningPlatforms,
              opts.p,
              opts.verbose
            );
          }, 60 * 1000);
        } else {
          await upSealService(
            app,
            instance,
            plugin.runningPlatforms,
            opts.p,
            opts.verbose
          );
        }
      }
    }
  }
};
