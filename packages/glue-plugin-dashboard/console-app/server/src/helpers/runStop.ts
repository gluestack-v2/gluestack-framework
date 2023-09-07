import { spawn, spawnSync } from 'child_process';
import path from 'path';
const projectPath = path.join(process.env.PROJECT_PATH || process.cwd());
import { globalServiceMap } from '../constant/globalServiceMap';
import DataStore from '../store/DataStore';
const dataStore = DataStore.getInstance();
export const runStop = () => {
  globalServiceMap.forEach((value, _key) => {
    spawnSync('sh', ['-c', `kill -9 ${value}`], {});
  });
  const spawnedProcess = spawn(
    'sh',
    ['-c', `cd ${projectPath} && node glue stop`],
    {
      detached: false,
    }
  );

  spawnedProcess?.stdout?.on('data', (data) => {
    dataStore.produce((draft: any) => {
      draft.runners.main.output = draft.runners.main.output + data.toString();
    });
  });

  spawnedProcess?.stderr?.on('data', (data) => {
    dataStore.produce((draft: any) => {
      draft.runners.main.output = draft.runners.main.output + data.toString();
    });
  });
};
