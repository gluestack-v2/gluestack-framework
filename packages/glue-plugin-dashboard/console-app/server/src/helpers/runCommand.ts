import path from 'path';
import { globalServiceMap } from '../constant/globalServiceMap';
import { executeDetached } from './executeDetached';
import { createDetachLog } from './createDetached';

import { runStart } from './runStart';
import { runStop } from './runStop';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const servicePath = path.join(
  process.env.PROJECT_PATH || process.cwd(),
  '.glue',
  '__generated__',
  'services'
);

export const runCommand = (patches: { service: string; command: string }) => {
  const { service, command } = patches;
  if (service === 'main' && command === 'start') {
    runStart();

    return;
  } else if (service === 'main' && command === 'stop') {
    runStop();
    return;
  }
  if (globalServiceMap.has(service) || service === 'main') {
    const boltCommand = convertCommandToBolt(service, command);
    executeDetached(
      boltCommand,
      service === 'main'
        ? process.env.PROJECT_PATH || process.cwd()
        : servicePath,
      service
    );
  } else {
    const childID = createDetachLog(servicePath, service);
    globalServiceMap.set(service, childID);
    runCommand({ service, command });
  }
};

const convertCommandToBolt = (service: string, command: string) => {
  if (service === 'main') {
    return `node glue ${command}`;
  } else {
    switch (command) {
      case 'up':
        return `bolt service:up ${service} -sr local ;`;
      case 'down':
        return `bolt service:down ${service} ; `;
      default:
        return `bolt service:up ${service} -sr local ;`;
    }
  }
};
