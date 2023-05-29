import {
  success,
  warning,
  error,
  info,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { exec, spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";
import {
  RunningPlatforms,
  RunningPlatform,
} from "@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin";
import { execute } from "../../helpers/execute";
import { executeMultipleTerminals } from "../../helpers/execute-multiple-terminals";
import IInstance from "@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance";
import { join, relative } from "path";

const upSealService = async (
  app: AppCLI,
  instance: IInstance,
  runningPlatforms: RunningPlatforms,
  platform: RunningPlatform
) => {
  const serviceName: string = instance.getName();

  let servicePlatform = platform;
  //TODO: refactor-later
  if (!runningPlatforms.includes(platform)) {
    // run in any platform in case option provided in not available in plugin's runningPlatforms
    servicePlatform = runningPlatforms[0];
  }

  executeMultipleTerminals(
    "sh",
    [
      "-c",
      `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal service:up -p ${servicePlatform} ${serviceName}`,
    ],
    { stdio: "inherit" }
  );
};

const installNPMDependencies = async (app: AppCLI) => {
  const services: string[] = app.getAllServicePaths();
  for await (const service of services) {
    info("Running npm install", relative(".", join(service, "src")));
    await execute(
      "sh",
      ["-c", `cd ${join(service, "src")} && npm run install:all`],
      { stdio: "inherit" }
    );
    console.log();
  }
};

export default async (app: AppCLI, opts: any): Promise<void> => {
  await installNPMDependencies(app);

  for await (const plugin of app.plugins) {
    for (let instance of plugin.instances) {
      success(
        `Seal service plugin instance found!`,
        `${plugin.getName()}:: ${instance.getName()}`
      );

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {
        if (plugin.getName() === "@gluestack-v2/glue-plugin-graphql") {
          setTimeout(async () => {
            await upSealService(app, instance, plugin.runningPlatforms, opts.p);
          }, 60 * 1000);
        } else {
          await upSealService(app, instance, plugin.runningPlatforms, opts.p);
        }
      }
    }
  }
};
