import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import {
  success,
  warning,
  error,
} from "@gluestack-v2/framework-cli/build/helpers/print";
import { fileExists } from "@gluestack/helpers";
import fs from "fs";
import * as prettier from "prettier";

const updateInternalsFile = async (
  pluginName: string,
  instanceName: string
) => {
  if (instanceName.indexOf("/") !== -1) {
    error(`${instanceName} is not valid, does not support nested instance.`);
    process.exit(0);
  }

  // adding the installed plugins
  const pluginInstancesFilePath =
    process.cwd() + "/.glue/internals/plugin-instances.json";

  const data = fs.readFileSync(pluginInstancesFilePath, { encoding: "utf-8" });
  const updatedInstanceArr = JSON.parse(data);
  JSON.parse(data)[pluginName].map((instanceInfo: any, index: number) => {
    if (instanceInfo.instance == instanceName) {
      updatedInstanceArr[pluginName].splice(index, 1);
    }
  });
  fs.writeFileSync(
    pluginInstancesFilePath,
    JSON.stringify(updatedInstanceArr),
    "utf8"
  );

  if (!fileExists(pluginInstancesFilePath)) {
    error("Instances file is missing. Please go to project's root directory.");
    process.exit(0);
  }
};

export default async (app: AppCLI, instanceName: any): Promise<void> => {
  for await (const plugin of app.plugins) {
    let instances = plugin.getInstances();
    for (let instance of instances) {
      if (instanceName == instance.getName()) {
        const folderPath = await plugin.getInstallationPath(instanceName);
        if (fs.existsSync(folderPath)) {
          // console.log(instance.getName(), "INSTANCE NAME", folderPath);
          try {
            fs.rmSync(folderPath, { recursive: true });
          } catch (err) {
            error(`${err}`);
          }
        }
        updateInternalsFile(plugin.getName(), instance.getName());
        await instance.runPostUninstall?.();
      }
    }
  }
};
