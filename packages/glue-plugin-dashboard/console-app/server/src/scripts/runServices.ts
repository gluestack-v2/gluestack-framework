import { getAllServices } from './getAllServices';
const pty = require('node-pty');
const os = require('os');
const platform = os.platform();
import { globalServiceMap } from '../constant/globalServiceMap';
const shell = platform === 'win32' ? 'powershell.exe' : process.env.SHELL;
export const runServices = async () => {
  const services = await getAllServices();
  Object.keys(services.services).forEach((service) => {
    const serviceTerminalProcessInstance = createTerminal(service);
    globalServiceMap.set(service, serviceTerminalProcessInstance);
  });
};

const createTerminal = (name: string) => {
  const ptyProcess = pty.spawn(shell, [], {
    name: name,
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  return ptyProcess;
};

runServices();
