import DataStore from '../store/DataStore';
import { spawn } from 'child_process';
const dataStore = DataStore.getInstance();
import { getAllServices } from './getAllServices';
import { globalServiceMap } from '../constant/globalServiceMap';
export const createDetachLog = async (
  servicePath: string,
  serviceName: string
) => {
  dataStore.produce((draft: any) => {
    draft.runners = {
      ...draft.runners,
      [serviceName]: {
        name: serviceName,
        commands: ['up', 'down'],
        output: '',
      },
    };
  });
  const command = 'sh';

  const args = ['-c', `cd ${servicePath} && bolt log -f ${serviceName}`];

  const spawnedProcess = spawn(command, args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'], // Redirect stdio to pipes for output and error
  });

  globalServiceMap.set(serviceName, spawnedProcess.pid);
  // Detach the child process
  spawnedProcess.unref();

  spawnedProcess.stdout.on('data', (data) => {
    const output = data.toString();
    sendData(output);
  });

  spawnedProcess.stderr.on('data', (data) => {
    const error = data.toString();
    sendData(error);
  });

  spawnedProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  spawnedProcess.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
  function sendData(data: any) {
    getAllServices().then((res) => {
      dataStore.produce((draft: any) => {
        draft.runners[serviceName].output =
          draft.runners[serviceName]?.output + data.toString();
        draft.runners[serviceName].status = res.services[serviceName].status;
      });
    });
  }
  return spawnedProcess.pid;
};
