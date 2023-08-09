import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error } from '@gluestack-v2/framework-cli/build/helpers/print';
import { fileExists } from '@gluestack/helpers';
import fs from 'fs';

const updateInternalsFile = async (
  pluginName: string,
  instanceName: string
) => {
  if (instanceName.indexOf('/') !== -1) {
    error(`${instanceName} is not valid, does not support nested instance.`);
    process.exit(0);
  }

  // adding the installed plugins
  const pluginInstancesFilePath =
    process.cwd() + '/.glue/internals/plugin-instances.json';

  const data = readFileSync(pluginInstancesFilePath, { encoding: 'utf-8' });
  const updatedInstanceArr = JSON.parse(data);

  JSON.parse(data)[pluginName].map((instanceInfo: any, index: number) => {
    if (instanceInfo.instance === instanceName) {
      updatedInstanceArr[pluginName].splice(index, 1);
    }
  });

  writeFileSync(
    pluginInstancesFilePath,
    JSON.stringify(updatedInstanceArr, null, 2),
    'utf8'
  );

  if (!fileExists(pluginInstancesFilePath)) {
    error("Instances file is missing. Please go to project's root directory.");
    process.exit(0);
  }
};

const removeFromPackageJson = (pluginName: string) => {
  const packageJsonPath = process.cwd() + '/package.json';
  const data = fs.readFileSync(packageJsonPath, { encoding: 'utf-8' });
  const packageJson = JSON.parse(data);
  packageJson.dependencies = removeKeyValuePair(
    JSON.parse(data).dependencies,
    pluginName
  );
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

function removeKeyValuePair(obj: any, keyToRemove: any) {
  if (obj.hasOwnProperty(keyToRemove)) {
    delete obj[keyToRemove];
  }
  return obj;
}

export default async (app: AppCLI, instanceName: any): Promise<void> => {
  for await (const plugin of app.plugins) {
    const instances = plugin.getInstances();
    for await (const instance of instances) {
      if (instanceName === instance.getName()) {
        const folderPath = instance._sourcePath;
        if (existsSync(folderPath)) {
          try {
            rmSync(folderPath, { recursive: true });
          } catch (err) {
            error(`${err}`);
          }
        }
        updateInternalsFile(plugin.getName(), instance.getName());
        removeFromPackageJson(plugin.getName());
        // await instance.runPostUninstall?.();
      }
    }
  }
};
