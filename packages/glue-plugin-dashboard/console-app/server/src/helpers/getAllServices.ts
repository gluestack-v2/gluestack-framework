const fs = require('fs');
const os = require('os');
const path = require('path');
import { parseYAML } from './parse-yaml';

require('dotenv').config();

const servicePath = path.join(
  process.env.PROJECT_PATH || process.cwd(),
  '.glue',
  '__generated__',
  'services',
  'bolt.yaml'
);

export const getAllServices = async () => {
  const data = await parseYAML(servicePath);
  const boltFolderPath = path.join(os.homedir(), '.bolt');
  const boltFilePath = path.join(boltFolderPath, `${data.project_id}.json`);
  const fileContent = fs.readFileSync(boltFilePath, 'utf8');
  const consoleData = JSON.parse(fileContent);
  return consoleData;
};
