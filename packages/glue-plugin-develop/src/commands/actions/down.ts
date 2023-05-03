import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { spawn } from "child_process";
import { GLUE_GENERATED_SEAL_SERVICES_PATH } from "@gluestack-v2/framework-cli/build/constants/gluestack.v2";


export default async (app: AppCLI): Promise<void> => {
  const sealUp = spawn("sh", [
    "-c",
    `cd ${GLUE_GENERATED_SEAL_SERVICES_PATH} && seal down`,
  ]);

  sealUp.stdout.on("data", (data) => {
    success(`${data}`);
  });

  sealUp.stderr.on("data", (data) => {
    error(`${data}`);
  });
};
