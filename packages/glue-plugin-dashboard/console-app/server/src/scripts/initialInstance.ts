import { spawn } from 'child_process';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const servicePath = path.join(process.env.PROJECT_PATH || process.cwd());

const init = async () => {
  spawn('sh', ['-c', `cd ${servicePath} && node glue start`], {
    stdio: 'inherit',
  });
};

init();
