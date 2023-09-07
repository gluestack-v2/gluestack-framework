import { executeSync } from '../../helpers/execute';
const path = require('path');
import { writeFile } from '@gluestack-v2/framework-cli/build/helpers/file/write-file';

const getPackagePath = () => {
  const packageJSONPath = require.resolve(
    '@gluestack-v2/glue-plugin-dashboard'
  );
  const packagePath = path.dirname(packageJSONPath);
  return packagePath;
};
export default async (): Promise<void> => {
  const packagePath = getPackagePath();
  const executePath = `PROJECT_PATH=${process.cwd()}`;

  writeFile(path.join(packagePath, 'console-app', '.env'), executePath);

  executeSync(
    'sh',
    [
      '-c',
      `cd ${path.join(
        packagePath,
        '..',
        'console-app',
        'client'
      )} && npm i --legacy-peer-deps`,
    ],
    {
      stdio: 'inherit',
    }
  );
  executeSync(
    'sh',
    ['-c', `cd ${path.join(packagePath)} && npm run console `],
    {
      stdio: 'inherit',
    }
  );
};
