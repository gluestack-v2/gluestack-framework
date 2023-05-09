import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { error } from "@gluestack-v2/framework-cli/build/helpers/print";
import { fileExists } from "@gluestack/helpers";

export default async (app: AppCLI, argument: any): Promise<void> => {
  console.log("Removing cron job...", argument);

  await app
    .getPluginByName("@gluestack-v2/glue-plugin-crons")
    // @ts-ignore
    ?.removeCronJob(argument);
};
