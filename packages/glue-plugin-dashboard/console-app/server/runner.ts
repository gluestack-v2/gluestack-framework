import { createTerminal } from './src/helpers/createTerminal';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const servicePath = path.join(
  // @ts-ignore
  process.env.PROJECT_PATH,
  '.glue',
  '__generated__',
  'services'
);

const runner = () => {
  const terminalMain = createTerminal('main');
  const serviceTerminalProcessInstance = createTerminal('web');

  const cmd = `cd ${servicePath} && bolt service:up web --service-runner="local"; \r`;
  const serviceLog = `cd ${servicePath} && bolt log web -f; \r`;
  serviceTerminalProcessInstance.on('data', (data: any) => {
    data.trim() !== 'exit' && ;
  });
  terminalMain.write(cmd);
  serviceTerminalProcessInstance.write(serviceLog);
};

runner();
