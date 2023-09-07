// import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { execute } from '../../helpers/execute';

export default async (): // app: AppCLI, opts: any
Promise<void> => {
  execute('sh', ['-c', `node glue down`], {
    stdio: 'inherit',
  });
};
