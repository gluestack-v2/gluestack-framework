import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { error } from "@gluestack-v2/framework-cli/build/helpers/print";
import { fileExists } from "@gluestack/helpers";

export default async (app: AppCLI, instanceName: any): Promise<void> => {
  // @ts-ignore
  await app.getPluginByName("@gluestack-v2/glue-plugin-crons")?.listCronJobs();
};
