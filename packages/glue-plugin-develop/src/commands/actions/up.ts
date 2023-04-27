import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { spawn } from "child_process";

const upSealService = (serviceName: string, opts: any) => {
  let servicePlatform = "local";

  const SEAL_SERVICES_PATH: string = ".glue/__generated__/seal/services/";
  const sealUp = spawn("sh", [
    "-c",
    `cd ${SEAL_SERVICES_PATH} && seal service:up -p ${servicePlatform} ${serviceName}`,
  ]);

  sealUp.stdout.on("data", (data) => {
    success(`${data}`);
  });

  sealUp.stderr.on("data", (data) => {
    error(`${data}`);
  });
}

export default async (app: AppCLI, opts: any): Promise<void> => {
  for await (const plugin of app.plugins) {
    let instances = plugin.getInstances();
    for (let instance of instances) {
      // @ts-ignore
      if (plugin.sealInit) {
        success("Seal service plugin found!");
        upSealService(instance.getName(), opts);
        warning(plugin.getName(), "NAME");
      }
    }
  }
};
