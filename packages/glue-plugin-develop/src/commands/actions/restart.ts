import { success } from '@gluestack-v2/framework-cli/build/helpers/print';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

import { GLUE_GENERATED_SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';
import {
  RunningPlatforms,
  RunningPlatform,
} from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';

import { executeMultipleTerminals } from '../../helpers/execute-multiple-terminals';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { execute } from '../../helpers/execute';

export default async (app: AppCLI, opts: any): Promise<void> => {
  execute('sh', ['-c', `node glue down && node glue up --verbose`], {
    stdio: 'inherit',
  });
};
