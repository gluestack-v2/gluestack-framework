import { writeFile } from './write-file';
import createFolder from './create-folder';
import { join } from 'path';
import copyFile from './copy-file';

export const createConfigPackage = async (
  packageName: string,
  configPath: string,
  generatedConfigPath: string
) => {
  await createFolder(join(generatedConfigPath, `${packageName}-config`));
  copyFile(
    join(configPath, 'index.ts'),
    join(join(generatedConfigPath, `${packageName}-config`), 'index.ts')
  );
  copyFile(
    join(configPath, `${packageName}.ts`),
    join(
      join(generatedConfigPath, `${packageName}-config`),
      `${packageName}.ts`
    )
  );

  writeFile(
    join(generatedConfigPath, 'package.json'),
    packageJsonTemplate(packageName)
  );
  writeFile(join(generatedConfigPath, 'index.ts'), indexTemplate(packageName));
  writeFile(join(generatedConfigPath, 'tsconfig.json'), tsConfigTemplate);
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
const indexTemplate = (packageName: string) => {
  return `
import { config as ${packageName}Config } from './${packageName}-config/${packageName}';
import { config as GlobalConfig } from './${packageName}-config/index';

function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const merged = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      // @ts-ignore
      const targetValue = merged[key as keyof (T & U)];

      if (sourceValue instanceof Object && targetValue instanceof Object) {
        // @ts-ignore
        merged[key as keyof (T & U)] = deepMerge(targetValue, sourceValue);
      } else {
        // @ts-ignore
        merged[key as keyof (T & U)] = sourceValue;
      }
    }
  }

  return merged as T & U;
}

type configValueType = {
  [key in keyof (typeof ${packageName}Config &
    typeof GlobalConfig)]: (typeof ${packageName}Config)[key] &
    (typeof GlobalConfig)[key];
};

function config(): typeof ${packageName}Config & typeof GlobalConfig;
function config(
  key: keyof (typeof ${packageName}Config & typeof GlobalConfig)
): configValueType;
function config(key?: keyof (typeof ${packageName}Config & typeof GlobalConfig)) {
  const mergedConfig = deepMerge(${packageName}Config, GlobalConfig);
  if (typeof key !== 'undefined') {
    return mergedConfig[key];
  }
  return mergedConfig;
}
export { config };
`;
};

const packageJsonTemplate = (packageName: string) => {
  return `{
	"name": "@project/${packageName}-config",
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
};
