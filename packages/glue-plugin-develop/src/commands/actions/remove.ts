import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import AppCLI from "@gluestack-v2/framework-cli/build/helpers/lib/app";
import { error } from "@gluestack-v2/framework-cli/build/helpers/print";
import { fileExists } from "@gluestack/helpers";

const updateInternalsFile = async (
  pluginName: string,
  instanceName: string
) => {
  if (instanceName.indexOf("/") !== -1) {
    error(`${instanceName} is not valid, does not support nested instance.`);
    process.exit(0);
  }

  // adding the installed plugins
  const pluginInstancesFilePath = process.cwd() + "/.glue/internals/plugin-instances.json";

  const data = readFileSync(pluginInstancesFilePath, { encoding: "utf-8" });
  const updatedInstanceArr = JSON.parse(data);

  JSON.parse(data)[pluginName].map((instanceInfo: any, index: number) => {
    if (instanceInfo.instance == instanceName) {
      updatedInstanceArr[pluginName].splice(index, 1);
    }
  });

  writeFileSync(
    pluginInstancesFilePath,
    JSON.stringify(updatedInstanceArr, null, 2),
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
    for await (let instance of instances) {

      if (instanceName == instance.getName()) {

        const folderPath = plugin.getInstallationPath(instanceName);
        if (existsSync(folderPath)) {
          try {
            rmSync(folderPath, { recursive: true });
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
