import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { info } from '@gluestack-v2/framework-cli/build/helpers/print';

import { execute } from '../../helpers/execute';
import { join, relative } from 'path';

const installNPMDependencies = async (app: AppCLI, pathName: any) => {
  // FIX: Run npm install only if package.json exists
  const services: string[] = app.getAllServicePaths();
  for await (const service of services) {
    if (pathName !== '' && !service.includes(pathName)) {
      continue;
    }

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
    if (pathName !== '' && !gluePackage.includes(pathName)) {
      continue;
    }

    info(
      'Running npm install and npm build',
      relative('.', join(gluePackage, 'src'))
    );

    await execute('sh', ['-c', `cd ${gluePackage} && npm run build`], {
      stdio: 'inherit',
    });
  }
};

export default async (app: AppCLI, packageName: any): Promise<void> => {
  await installNPMDependencies(app, packageName);
};
