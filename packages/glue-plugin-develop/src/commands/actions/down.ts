import { success } from '@gluestack-v2/framework-cli/build/helpers/print';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { GLUE_GENERATED_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

import { execute } from '../../helpers/execute';

const downboltService = async () =>
  // serviceName: string
  {
    await execute(
      'sh',
      ['-c', `cd ${GLUE_GENERATED_SERVICES_PATH} && bolt down`],
      {
        stdio: 'inherit',
      }
    );
  };

// const dockerVolumeCleanup = async () => {
//   console.log('heree');
//   await execute('docker', ['volume', 'prune', '-f'], { stdio: 'inherit' });
//   console.log('still heree');
// };

export default async (app: AppCLI): Promise<void> => {
  for await (const plugin of app.plugins) {
    for (const instance of plugin.instances) {
      success(
        `bolt service plugin instance found!`,
        `${plugin.getName()}::${instance.getName()}`
      );

      if (plugin.runningPlatforms.length <= 0) {
        continue;
      } else {
        await downboltService(instance.getName());
      }
    }
  }

  // await dockerVolumeCleanup();
};
