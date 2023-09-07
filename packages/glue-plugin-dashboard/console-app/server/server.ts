/* eslint-disable no-console */
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
import DataStore from './src/store/DataStore';
import { runCommand } from './src/helpers/runCommand';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
});

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
  //Emit Patch to the client
  io.emit('patches.pushed', patches);
});

dataStore.produce((draft: any) => {
  draft.runners = {
    main: {
      name: 'main',
      commands: ['start', 'stop', 'up', 'down'],
      output: '',
    },
  };
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
