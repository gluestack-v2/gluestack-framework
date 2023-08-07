const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
import DataStore from './src/store/DataStore';
import { getAllServices } from './src/helpers/getAllServices';
import { runCommand } from './src/helpers/runCommand';
import path from 'path';
import { createDetachLog } from './src/helpers/createDetachlog';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const servicePath = path.join(
  '/Users/virajajayjoshi/WorkSpace/gluestack-framework/example/gluestack-app',
  '.glue',
  '__generated__',
  'services'
);
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// require('./src/scripts/initialInstance');

const dataStore = DataStore.getInstance();

//Initial Handshake
io.on('connection', (socket: any) => {
  socket.on('run.command', (patches: any) => {
    runCommand(patches);
  });
  console.log('a user connected on server');
  io.to(socket.id).emit('handshake', dataStore.getPatches());
});

//Receive Patch

dataStore.on('patches.pushed', (patches: any) => {
  console.log('patches.pushed');
  //Emit Patch to the client
  console.log(dataStore.getValue());
  io.emit('patches.pushed', patches);
});

const data = getAllServices();

data.then((res) => {
  let runnerDrafts = {};
  Object.keys(res.services).map((service) => {
    console.log(res.services[service], 'service >>>>>>');

    runnerDrafts = {
      ...runnerDrafts,
      [service]: {
        name: service,
        commands: ['up', 'down'],
        output: '',
        status: res.services[service].status,
      },
    };
  });

  dataStore.produce((draft: any) => {
    draft.services = res;
    draft.runners = {
      main: {
        name: 'main',
        commands: ['build', 'prepare', 'up', 'down'],
        output: '',
      },
      ...runnerDrafts,
    };
  });
  Object.keys(res.services).map((service) => {
    createDetachLog(servicePath, service);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
