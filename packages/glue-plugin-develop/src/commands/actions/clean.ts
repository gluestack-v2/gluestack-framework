import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error } from '@gluestack-v2/framework-cli/build/helpers/print';
import { fileExists } from '@gluestack/helpers';
import path from 'path';

const updateInternalsFile = async () => {
  // adding the installed plugins
  const pluginInstancesFilePath =
    process.cwd() + '/.glue/internals/plugin-instances.json';
  const pluginListFilePath = process.cwd() + '/.glue/internals/plugins.json';

  writeFileSync(
    pluginInstancesFilePath,
    `
    {
      "@gluestack-v2/glue-plugin-develop": [
        {
          "instance": "develop",
          "directory": "./develop",
          "container_store": {}
        }
      ]
    }    
    `,
    'utf8'
  );
  writeFileSync(
    pluginListFilePath,
    `
    {
      "@gluestack-v2/glue-plugin-develop": {
        "package": "@gluestack-v2/glue-plugin-develop"
      }
    }    
    `,
    'utf8'
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
      if (instance) {
        const folderPath = plugin.getInstallationPath(instance.getName());
        console.log(`Removing ${folderPath}`);

        if (existsSync(folderPath)) {
          try {
            rmSync(folderPath, { recursive: true });
          } catch (err) {
            error(`${err}`);
          }
        }

        await updateInternalsFile();

        // update root package json to remove sourcepath workspaces and destination path workspaces
        // await instance.runPostUninstall?.();
      }
    }
  }
  const rootPackagePath: string = path.join(process.cwd(), 'package.json');
  const ROOT_PACKAGE_JSON_WORKSPACES = ['../../packages/*'];
  const ROOT_PACKAGE_JSON_DEV_DEPS = {
    '@gluestack-v2/glue-plugin-develop': '^0.0.*',
  };
  let pkgJson = require(rootPackagePath);
  pkgJson.workspaces = ROOT_PACKAGE_JSON_WORKSPACES;
  pkgJson.dependencies = ROOT_PACKAGE_JSON_DEV_DEPS;
  writeFileSync(rootPackagePath, JSON.stringify(pkgJson, null, 2));

  removeFolder(path.join(process.cwd(), '.glue', '__generated__'));
  removeFolder(path.join(process.cwd(), 'client'));
  removeFolder(path.join(process.cwd(), 'server'));
  console.log(`Clean successful!`);
};

const removeFolder = (absolutePath) => {
  try {
    rmSync(absolutePath, {
      recursive: true,
    });
  } catch (error) {
    console.log(`${absolutePath} not found!`);
  }
};
