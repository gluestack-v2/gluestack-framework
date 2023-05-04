import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";

const upSealService = (serviceName: string, opts: any) => {
  let servicePlatform = "local";

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

const upAllServices = () => {
  let servicePlatform = "local";

  const sealUp = spawn("sh", [
    "-c",
    `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal up`,
  ]);

  sealUp.stdout.on("data", (data) => {
    success(`${data}`);
  });

  sealUp.stderr.on("data", (data) => {
    error(`${data}`);
  });
};

export default async (app: AppCLI, opts: any): Promise<void> => {
  // upAllServices();
  for await (const plugin of app.plugins) {
    let instances = plugin.getInstances();
    for (let instance of instances) {
      // @ts-ignore
      success("Seal service plugin found!");
      upSealService(instance.getName(), opts);
      warning(plugin.getName(), "NAME");
    }
  }
};