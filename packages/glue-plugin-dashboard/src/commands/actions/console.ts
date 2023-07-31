import { executeSync } from '../../helpers/execute';
import { writeFileSync } from 'fs';
const path = require('path');
const getPackagePath = () => {
  const packageJSONPath = require.resolve(
    path.join('@gluestack-v2/glue-plugin-dashboard', 'package.json')
  );
  const packagePath = path.dirname(packageJSONPath);
  return packagePath;
};
export default async (): Promise<void> => {
  const packagePath = getPackagePath();
  const executePath = `PROJECT_PATH=${process.cwd()}`;

  writeFileSync(path.join(packagePath, 'console-app', '.env'), executePath);
  executeSync(
    'sh',
    ['-c', `cd ${path.join(packagePath, 'console-app')} && npm run dev`],
    {
      stdio: 'inherit',
    }
  );
};
