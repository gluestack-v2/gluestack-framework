import { Workspaces } from '@gluestack/helpers';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import {
  error,
  success,
  warning,
} from '@gluestack-v2/framework-cli/build/helpers/print';

import { FOLDER_STRUCTURE } from '../../constants/folder-structure';
import createFoldersFromJson from '../../helpers/create-folders-from-json';
import { GLUE_GENERATED_PACKAGES_PATH } from '../../constants/glue-generated-packages';
import { join } from 'path';
import copyFolder from '../../helpers/copy-folder';
import writeFile from '../../helpers/write-file';

export default async (app: AppCLI, pluginName: string = ''): Promise<void> => {
  // creates folders from FOLDER_STRUCTURE constant
  await createFoldersFromJson(FOLDER_STRUCTURE, process.cwd());

  // add __generated__/packages into workspaces
  await Workspaces.append(
    `${process.cwd()}/package.json`,
    GLUE_GENERATED_PACKAGES_PATH
  );

  const configPath = join(process.cwd(), 'config');
  const generatedPath = join(GLUE_GENERATED_PACKAGES_PATH, 'config');
  copyFolder(configPath, generatedPath, 8);
  writeFile(join(generatedPath, 'package.json'), packageJsonTemplate);
  writeFile(join(generatedPath, 'index.ts'), indexTemplate);
  writeFile(join(generatedPath, 'tsconfig.json'), tsConfigTemplate);

  // builds plugins
  for await (const plugin of app.plugins) {
    if (pluginName !== '' && plugin.getName() !== pluginName) {
      continue;
    }

    success('Found plugin', plugin.getName());

    if (!plugin.build) {
      warning(`${plugin.getName()}`, 'contains no build method, skipping...');
      continue;
    }

    warning(plugin.getName(), 'building...');
    try {
      await plugin.build();
    } catch (e) {
      console.log('>>>>', e);
      error(plugin.getName(), 'build failed');
    }
  }
};
const tsConfigTemplate = `
{
	"compilerOptions": {
		"target": "es6",
		"lib": ["es6", "es2015", "dom"],
		"declaration": true,
		"outDir": "build",
		"strict": true,
		"types": ["node"],
		"esModuleInterop": true,
		"module": "CommonJS",
		"moduleResolution": "node",
		"allowJs": true
	}
}
`;
const indexTemplate = `
import { config as ServerConfig } from './config/server';
import { config as ClientConfig } from './config/client';
import { config as GlobalConfig } from './config/index';

function deepMerge(obj1, obj2) {
  const merged = { ...obj1 };

  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        obj2[key] instanceof Object &&
        key in obj1 &&
        obj1[key] instanceof Object
      ) {
        merged[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
}

// export const config = (configPath: string) => {
// 	const configPathArray = configPath.split('.');
// 	configPathArray.forEach((path) => {
// 		// @ts-ignore
// 		GeneratedConfig = GeneratedConfig[path];
// 	});
// 	return GeneratedConfig;
// };

export const config = () => {
  const mergedServerConfig = deepMerge(ServerConfig, GlobalConfig);
  const mergedClientConfig = deepMerge(ClientConfig, GlobalConfig);
  if (typeof window !== "undefined") {
    return mergedClientConfig;
  } else {
    return mergedServerConfig;
  }
};

`;

const packageJsonTemplate = `{
	"name": "@project/config",
	"version": "0.0.10",
	"description": "Gluestack V2 SDK",
	"main": "build/index.js",
	"scripts": {
		"build": "tsc",
		"watch": "tsc --watch",
		"lint": "prettier --write ."
	},
	"keywords": [
		"gluestack",
		"v2",
		"fullstack",
		"framework",
		"cli",
		"mobile",
		"web",
		"storybook",
		"shared-components"
	],
	"license": "MIT",
	"dependencies": {
		"colors": "^1.4.0",
		"commander": "^10.0.0",
		"lodash": "^4.17.21",
		"typescript": "^5.0.2",
		"source-map": "^0.7.4"
	},
	"devDependencies": {
		"@types/lodash": "^4.14.192",
		"@types/node": "^18.15.5",
		"prettier": "^2.8.6"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/gluestack-v2/framework-cli",
		"directory": "packages/cli"
	}
}
`;
