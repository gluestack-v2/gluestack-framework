import path from 'path';
import { globalServiceMap } from '../constant/globalServiceMap';
import { executeDetached } from './executeDetached';
import { createDetachLog } from './createDetachlog';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const servicePath = path.join(
  '/Users/virajajayjoshi/WorkSpace/gluestack-framework/example/gluestack-app',
  '.glue',
  '__generated__',
  'services'
);

const appPath = path.join(
  '/Users/virajajayjoshi/WorkSpace/gluestack-framework/example/gluestack-app'
);
export const runCommand = (patches: { service: string; command: string }) => {
  const { service, command } = patches;
  if (globalServiceMap.has(service) || service === 'main') {
    const boltCommand = convertCommandToBolt(service, command);
    executeDetached(
      boltCommand,
      service === 'main' ? appPath : servicePath,
      {}
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
