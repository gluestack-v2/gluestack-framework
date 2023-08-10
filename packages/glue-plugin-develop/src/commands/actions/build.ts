import { Workspaces } from '@gluestack/helpers';
import {
  error,
  success,
  warning,
} from '@gluestack-v2/framework-cli/build/helpers/print';

import { FOLDER_STRUCTURE } from '../../constants/folder-structure';
import createFoldersFromJson from '../../helpers/create-folders-from-json';
import { GLUE_GENERATED_PACKAGES_PATH } from '../../constants/glue-generated-packages';
import { GlueStackPlugin } from '../..';

export default async (
  callerPlugin: GlueStackPlugin,
  pluginName: string = ''
): Promise<void> => {
  // creates folders from FOLDER_STRUCTURE constant
  await createFoldersFromJson(FOLDER_STRUCTURE, process.cwd());

  // add __generated__/packages into workspaces
  await Workspaces.append(
    `${process.cwd()}/package.json`,
    GLUE_GENERATED_PACKAGES_PATH + '/**'
  );

  // builds plugins
  for await (const plugin of callerPlugin.app.plugins) {
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
      console.error('>>>>', e);
      error(plugin.getName(), 'build failed');
    }
  }
};

// const createPackage = async (packageName: string) => {
//   const configPath = join(process.cwd(), 'config');
//   const generatedConfigPath = join(
//     process.cwd(),
//     GLUE_GENERATED_PACKAGES_PATH,
//     `${packageName}-config`
//   );

//   await createFolder(join(generatedConfigPath, `src`));
//   copyFile(
//     join(configPath, 'index.ts'),
//     join(join(generatedConfigPath, `src`), 'index.ts')
//   );
//   copyFile(
//     join(configPath, `${packageName}.ts`),
//     join(join(generatedConfigPath, `src`), `${packageName}.ts`)
//   );

//   writeFile(
//     join(generatedConfigPath, 'package.json'),
//     packageJsonTemplate(packageName)
//   );
//   writeFile(join(generatedConfigPath, 'index.ts'), indexTemplate(packageName));
//   writeFile(join(generatedConfigPath, 'tsconfig.json'), tsConfigTemplate);
// };

// const tsConfigTemplate = `
// {
// 	"compilerOptions": {
// 		"target": "es6",
// 		"lib": ["es6", "es2015", "dom"],
// 		"declaration": true,
// 		"outDir": "build",
// 		"strict": true,
// 		"types": ["node"],
// 		"esModuleInterop": true,
// 		"module": "CommonJS",
// 		"moduleResolution": "node",
// 		"allowJs": true
// 	}
// }
// `;
// const indexTemplate = (packageName: string) => {
//   return `
// import { config as ${packageName}Config } from './${packageName}-config/${packageName}';
// import { config as GlobalConfig } from './${packageName}-config/index';

// function deepMerge<T extends object, U extends object>(
//   target: T,
//   source: U
// ): T & U {
//   const merged = { ...target };

//   for (const key in source) {
//     if (source.hasOwnProperty(key)) {
//       const sourceValue = source[key];
//       // @ts-ignore
//       const targetValue = merged[key as keyof (T & U)];

//       if (sourceValue instanceof Object && targetValue instanceof Object) {
//         // @ts-ignore
//         merged[key as keyof (T & U)] = deepMerge(targetValue, sourceValue);
//       } else {
//         // @ts-ignore
//         merged[key as keyof (T & U)] = sourceValue;
//       }
//     }
//   }

//   return merged as T & U;
// }

// type configValueType = {
//   [key in keyof (typeof ${packageName}Config &
//     typeof GlobalConfig)]: (typeof ${packageName}Config)[key] &
//     (typeof GlobalConfig)[key];
// };

// function config(): typeof ${packageName}Config & typeof GlobalConfig;
// function config(
//   key: keyof (typeof ${packageName}Config & typeof GlobalConfig)
// ): configValueType;
// function config(key?: keyof (typeof ${packageName}Config & typeof GlobalConfig)) {
//   const mergedConfig = deepMerge(${packageName}Config, GlobalConfig);
//   if (typeof key !== 'undefined') {
//     return mergedConfig[key];
//   }
//   return mergedConfig;
// }
// export { config };
// `;
// };

// const packageJsonTemplate = (packageName: string) => {
//   return `{
// 	"name": "@project/${packageName}-config",
// 	"version": "0.0.10",
// 	"description": "Gluestack V2 SDK",
// 	"main": "build/index.js",
// 	"scripts": {
// 		"build": "tsc",
// 		"watch": "tsc --watch",
// 		"lint": "prettier --write ."
// 	},
// 	"keywords": [
// 		"gluestack",
// 		"v2",
// 		"fullstack",
// 		"framework",
// 		"cli",
// 		"mobile",
// 		"web",
// 		"storybook",
// 		"shared-components"
// 	],
// 	"license": "MIT",
// 	"dependencies": {
// 		"colors": "^1.4.0",
// 		"commander": "^10.0.0",
// 		"lodash": "^4.17.21",
// 		"typescript": "^5.0.2",
// 		"source-map": "^0.7.4"
// 	},
// 	"devDependencies": {
// 		"@types/lodash": "^4.14.192",
// 		"@types/node": "^18.15.5",
// 		"prettier": "^2.8.6"
// 	},
// 	"repository": {
// 		"type": "git",
// 		"url": "https://github.com/gluestack-v2/framework-cli",
// 		"directory": "packages/cli"
// 	}
// }
// `;
// };
