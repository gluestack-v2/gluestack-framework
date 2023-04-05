import { Workspaces } from "@gluestack/helpers";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import {
  error,
  success,
  warning,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import path from "path";
import { FOLDER_STRUCTURE } from "../../constants/folder-structure";
import createFoldersFromJson from "../../helpers/create-folders-from-json";
import { GLUE_GENERATED_PACKAGES_PATH } from "../../constants/glue-generated-packages";

const add = (a: any, b: any) => {
  console.log(a, b);
  return a + b;
};

export default async (app: AppCLI): Promise<void> => {
  // builds plugins
  for await (const plugin of app.plugins) {
    if (plugin.getName() == "@gluestack-v2/glue-plugin-service-gateway") {
      // @ts-ignore
      plugin.generateService("./functions");
    }
  }
};
