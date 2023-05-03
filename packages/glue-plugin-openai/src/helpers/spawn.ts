import { spawn }  from 'node:child_process';

export const execute = (
  command: string,
  args: string[],
  options: any
) =>
  new Promise((resolve, reject) => {
    let output: string = '';

    const child = spawn(command, args, options);

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        output += data.toString();
      });
    }

    child.on('exit', () => resolve(output));

    child.on('close',
      (code) => (code === 0)
        ? resolve(output) : reject(`failed with code ${code}`));
  });
