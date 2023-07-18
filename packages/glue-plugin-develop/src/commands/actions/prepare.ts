import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { info } from '@gluestack-v2/framework-cli/build/helpers/print';

import { execute } from '../../helpers/execute';
import { join, relative } from 'path';

const installNPMDependencies = async (app: AppCLI) => {
  const services: string[] = app.getAllServicePaths();
  for await (const service of services) {
    info(
      'Running npm install and npm build',
      relative('.', join(service, 'src'))
    );
    await execute(
      'sh',
      ['-c', `cd ${join(service, 'src')} && npm run install:all`],
      { stdio: 'inherit' }
    );
  }

  const packages: string[] = app.getAllPackagePaths();
  for await (const gluePackage of packages) {
    info(
      'Running npm install and npm build',
      relative('.', join(gluePackage, 'src'))
    );

    await execute('sh', ['-c', `cd ${gluePackage} && npm i && npm run build`], {
      stdio: 'inherit',
    });
  }
};

export default async (app: AppCLI): Promise<void> => {
  await installNPMDependencies(app);
};
