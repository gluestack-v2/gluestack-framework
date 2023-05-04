import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { exec, spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";
import { RunningPlatforms, RunningPlatform } from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

export const execute = (
  command: string,
  args: string[],
  options: any
) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.on('exit', () => resolve('done'));

    child.on('close',
      (code) => (code === 0)
        ? resolve('done') : reject('failed'));
  });

const downSealService = async (serviceName: string) => {
  await execute("sh", [
    "-c",
    `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal service:down ${serviceName}`,
  ], {
    stdio: 'inherit'
  });
};

const dockerVolumeCleanup = async () => {
  await execute("docker", [
    "volume",
    "prune",
    "-f"
  ], { stdio: 'inherit' });
};

export default async (app: AppCLI): Promise<void> => {
  for await (const plugin of app.plugins) {
    for (let instance of plugin.instances) {

      success(`Seal service plugin instance found!`, `${plugin.getName()}::${instance.getName()}`);

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {
        await downSealService(instance.getName());
      }
    }
  }

  await dockerVolumeCleanup();
};