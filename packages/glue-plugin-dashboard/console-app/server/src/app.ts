// src/app.ts
import express from 'express';
import { globalServiceMap } from './constant/globalServiceMap';
const app = express();
const path = require('path');
require('dotenv').config();

const servicePath = path.join(
  process.env.PROJECT_PATH || process.cwd(),
  '.glue',
  '__generated__',
  'services'
);

require('./scripts/runServices');
// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/upService', (req, res) => {
  const { service } = req.query;
  console.log('service>>>>>>>>>>>>>>\n', service, '\n>>>>>>>>>>>service');

  const serviceTerminalProcessInstance = globalServiceMap.get('web');
  console.log(
    '🚀 ~ app.get ~ serviceTerminalProcessInstance:',
    serviceTerminalProcessInstance
  );
  const cmd = `cd ${servicePath} && bolt service:up web`;
  serviceTerminalProcessInstance.write(cmd);
  serviceTerminalProcessInstance.on('data', (data: any) => {
    console.log(data);
  });

  serviceTerminalProcessInstance.on('exit', (code: number) => {
    serviceTerminalProcessInstance.kill();
  });
  res.send('Hello, World!');
});

export default app;
