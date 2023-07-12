import { success } from '@gluestack-v2/framework-cli/build/helpers/print';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import {
  RunningPlatforms,
  RunningPlatform,
} from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';

import { executeMultipleTerminals } from '../../helpers/execute-multiple-terminals';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { execute, executeSync } from '../../helpers/execute';

export default async (app: AppCLI, opts: any): Promise<void> => {
  executeSync('sh', ['-c', `node glue down`], {
    stdio: 'inherit',
  });

  executeSync('sh', ['-c', `node glue build`], {
    stdio: 'inherit',
  });

  executeSync('sh', ['-c', `node glue prepare`], {
    stdio: 'inherit',
  });

  execute('sh', ['-c', `node glue up --verbose`], {
    stdio: 'inherit',
  });

  execute('sh', ['-c', `node glue watch`], {
    stdio: 'inherit',
  });
};
