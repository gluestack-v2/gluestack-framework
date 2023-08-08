import DataStore from '../store/DataStore';
import { spawn } from 'child_process';
const dataStore = DataStore.getInstance();
import { getAllServices } from './getAllServices';

export const executeDetached = async (
  command: string,
  servicePath: string,
  service: string,
  options?: any
) => {
  const runner = 'sh';

  const args = ['-c', `cd ${servicePath} && ${command}`];

  const spawnedProcess = spawn(runner, args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'], // Redirect stdio to pipes for output and error
  });

  // Detach the child process
  spawnedProcess.unref();

  spawnedProcess.stdout.on('data', (data) => {
    const output = data.toString();
    sendData(output, command);
  });

  spawnedProcess.stderr.on('data', (data) => {
    const error = data.toString();
    sendData(error, command);
  });

  spawnedProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  function sendData(data: any, command: string) {
    getAllServices().then((res) => {
      dataStore.produce((draft: any) => {
        draft.runners.main.output = draft.runners.main.output + data.toString();

        if (
          (service === 'main' && command === 'node glue up') ||
          command === 'node glue down'
        ) {
          console.log('up', '>>>>>>>>>\n');
          Object.keys(res.services).map((serviceName) => {
            draft.runners[serviceName].output =
              draft.runners?.[serviceName].output + data.toString();
            draft.runners[serviceName].status =
              res.services[serviceName].status;
          });
        } else if (service !== 'main') {
          draft.runners[service].output =
            draft.runners?.[service].output + data.toString();
          draft.runners[service].status = res.services[service].status;
        }
      });
    });
  }
  return spawnedProcess.pid;
};
