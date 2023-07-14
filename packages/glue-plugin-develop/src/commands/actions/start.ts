import { execute, executeSync } from '../../helpers/execute';

export default async (): Promise<void> => {
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
