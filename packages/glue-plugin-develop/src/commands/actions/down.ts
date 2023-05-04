import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";
import { RunningPlatforms, RunningPlatform } from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";

const downSealService = (serviceName: string) => {
  const sealUp = spawn("sh", [
    "-c",
    `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal service:down ${serviceName}`,
  ]);

  sealUp.stdout.on("data", (data) => {
    success(`${data}`);
  });

  sealUp.stderr.on("data", (data) => {
    error(`${data}`);
  });
};

export default async (app: AppCLI): Promise<void> => {
  for await (const plugin of app.plugins) {
    for (let instance of plugin.instances) {

      success(`Seal service plugin instance found!`, `${plugin.getName()}::${instance.getName()}`);

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {
        downSealService(instance.getName());
      }
    }
  }
};