import DataStore from '../store/DataStore';
import { spawn } from 'child_process';
const dataStore = DataStore.getInstance();
import path from 'path';
const projectPath = path.join(process.env.PROJECT_PATH || process.cwd());

export const createWatcher = async () => {
  const command = 'sh';

  const args = ['-c', `cd ${projectPath} && node glue watch`];

  const spawnedProcess = spawn(command, args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'], // Redirect stdio to pipes for output and error
  });

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

  return spawnedProcess.pid;
};

function sendData(data: any) {
  dataStore.produce((draft: any) => {
    draft.runners.main.output = draft.runners.main?.output + data.toString();
  });
}
