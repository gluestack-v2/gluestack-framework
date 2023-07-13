const { spawn, spawnSync } = require('child_process');

spawnSync('sh', ['-c', `node glue add @gluestack-v2/glue-plugin-web web`], {
  stdio: 'inherit',
});

spawnSync('sh', ['-c', `node glue add @gluestack-v2/glue-plugin-sdk sdk`], {
  stdio: 'inherit',
});

spawnSync(
  'sh',
  ['-c', `node glue add @gluestack-v2/glue-plugin-service-gateway gateway`],
  {
    stdio: 'inherit',
  }
);

spawnSync(
  'sh',
  ['-c', `node glue add @gluestack-v2/glue-plugin-functions functions`],
  {
    stdio: 'inherit',
  }
);
