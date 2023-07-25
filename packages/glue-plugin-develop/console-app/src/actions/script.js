const { spawnSync } = require('child_process');
const { spawn } = require('child_process');
import fs, { writeFile } from 'fs';
import path, { join } from 'path';
const filePath = join(
  process.env.PROJECT_PATH,
  '.glue',
  'internals',
  'plugin-instances.json'
);
const loggerFilePath = path.resolve('public', 'log.txt');
const servicePath = join(
  process.env.PROJECT_PATH,
  '.glue',
  '__generated__',
  'services'
);
export const logger = (string) => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw;
};

export const runCommand = (command) => {
  const commandToExecute = ` cd ${process.env.PROJECT_PATH} && node glue ${command}`;

  const openTerminalScript = `
tell application "Terminal"
    activate
    do script "${commandToExecute}"
end tell
`;
  const terminal = spawn('osascript', ['-e', openTerminalScript]);
  terminal.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  terminal.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    return true;
  });
};

export const writeLogs = (command) => {
  const logger = spawn('sh', [
    '-c',
    `cd ${servicePath} && bolt log --follow web`,
  ]);
  logger.stdout.on('data', (data) => {
    writeFile(loggerFilePath, data, (err) => {});
  });
};
