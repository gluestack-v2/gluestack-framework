const path = require('path');
const os = require('os');
const pty = require('node-pty');
const platform = os.platform();
let shell = platform === 'win32' ? 'powershell.exe' : process.env.SHELL;

export function run(command, exit, canManageProcess = true) {
  return new Promise(function (resolve, reject) {
    if (platform === 'win32') {
      // command = `CLS ; ${command}`;
    } else {
      command = `echo -e '\\x1bc' && ${command}`;
    }
    let ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.PROJECT_PATH,
      env: process.env,
    });
    //Execute shell command
    const cmd = `${command} ; ${typeof exit === 'undefined' ? 'exit' : ''}\r`;
    console.log(
      `🚀 LOG | file: RunCommand.js | line 74 | Executing command ... `,
      cmd
    );
    ptyProcess.write(cmd);

    ptyProcess.on('data', (data) => {
      if (data.trim() != 'exit') {
        console.log(data);
      }
    });
    ptyProcess.on('exit', (code) => {
      ptyProcess.kill();
    });
    resolve(ptyProcess);
  });
}
