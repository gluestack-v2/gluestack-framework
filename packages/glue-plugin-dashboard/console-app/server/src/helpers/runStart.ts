import { spawn } from 'child_process';
import path from 'path';
const projectPath = path.join(process.env.PROJECT_PATH || process.cwd());
const servicePath = path.join(
  process.env.PROJECT_PATH || process.cwd(),
  '.glue',
  '__generated__',
  'services'
);
import { createWatcher } from './createWatcher';
import { globalServiceMap } from '../constant/globalServiceMap';
const sequenceExecution = ['build', 'prepare', 'up'];
import DataStore from '../store/DataStore';
import { getAllServices } from './getAllServices';
import { createDetachLog } from './createDetached';
const dataStore = DataStore.getInstance();
export const runStart = (counter: number = 0) => {
  dataStore.produce((draft: any) => {
    draft.runners.main.output += `[34mRunning node glue ${sequenceExecution[counter]}[39m \n`;
  });
  const spawnedProcess = spawn(
    'sh',
    ['-c', `cd ${projectPath} && node glue ${sequenceExecution[counter]}`],
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

  spawnedProcess.on('exit', function (code, _signal) {
    if (sequenceExecution[counter + 1] && code === 0) {
      runStart(counter + 1);
    } else if (code === 0) {
      executeGetAllServices().then(() => {
        const WatcherID = createWatcher();
        globalServiceMap.set('watcher', WatcherID);
      });
    }
  });
};

const executeGetAllServices = async () => {
  dataStore.produce((draft: any) => {
    draft.runners.main.output += `[34mCreate terminals for services [39m \n`;
  });
  getAllServices().then((res) => {
    Object.keys(res.services).map((serviceName) => {
      createDetachLog(servicePath, serviceName);
    });
  });
};
