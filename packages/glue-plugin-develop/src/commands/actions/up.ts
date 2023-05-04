import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";
import { RunningPlatforms, RunningPlatform } from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import { fileExists } from "@gluestack/helpers";
import { copyFile } from "fs/promises";
import { join } from "path";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";

const upSealService = async (instance: IInstance, runningPlatforms: RunningPlatforms, platform: RunningPlatform) => {
  const serviceName: string = instance.getName();

  let servicePlatform = platform;
  //TODO: refactor-later
  if (!runningPlatforms.includes(platform)) {
    // run in any platform in case option provided in not available in plugin's runningPlatforms
    servicePlatform = runningPlatforms[0];
  }

  // if .env file exists, create a .env.tpl

  console.log(join(instance._destinationPath, '.env'), ">>>>nhhhhh")
  if (await fileExists(join(instance._destinationPath, '.env'))) {
    await copyFile(
      join(instance._destinationPath, '.env'),
      join(instance._destinationPath, '.env.tpl')
    );
  }

  const sealUp = spawn("sh", [
    "-c",
    `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal service:up -p ${servicePlatform} ${serviceName}`,
  ]);

  sealUp.stdout.on("data", (data) => {
    success(`${data}`);
  });

  sealUp.stderr.on("data", (data) => {
    error(`${data}`);
  });
};

export default async (app: AppCLI, opts: any): Promise<void> => {
  for await (const plugin of app.plugins) {
    for (let instance of plugin.instances) {

      success(`Seal service plugin instance found!`, `${plugin.getName()}::${instance.getName()}`);

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {

        if (plugin.getName() === '@gluestack-v2/glue-plugin-graphql') {
          setTimeout(async () => {
            await upSealService(instance, plugin.runningPlatforms, opts.p);

          }, 60 * 1000);
        } else {
          await upSealService(instance, plugin.runningPlatforms, opts.p);
        }
      }
    }
  }
};