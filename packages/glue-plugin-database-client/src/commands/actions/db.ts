import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { error } from "@gluestack-v2/framework-cli/build/helpers/print";
import { fileExists } from "@gluestack/helpers";
import { log } from "console";

export default async (app: AppCLI, argument: any): Promise<void> => {
  let dbclientPlugin = app.getPluginByName(
    "@gluestack-v2/glue-plugin-database-client"
  );
  let dbclientInstance = dbclientPlugin?.getInstances()[0];
  if (!dbclientInstance) {
    error("No database client instance found");
    return;
  }
  let generatePath = `${dbclientInstance._destinationPath}`;
  // @ts-ignore
  await dbclientInstance.dbCommandService(generatePath, argument);
};
