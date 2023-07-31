const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
import { setInterval, setTimeout } from 'timers';
import DataStore from './DataStore';

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const dataStore = new DataStore();

//Initial Handshake
io.on('connection', (socket: any) => {
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

dataStore.produce((draft: any) => {
  draft.runners = [];
  draft.movies = [];

  draft.runners.push({
    name: 'runner-1',
    commands: ['start', 'build', 'up', 'down'],
    output: '',
    status: 'up',
  });

  draft.runners.push({
    name: 'runner-2',
    commands: ['start', 'build', 'up', 'down'],
    output: '',
    status: 'up',
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});

setInterval(() => {
  dataStore.produce((draft: any) => {
    //draft.runners.output = `${draft.runners.output} ${Math.random()}`;
    //draft.arr.push(Math.random());
    draft.runners[0].output = `${draft.runners[0].output} ${Math.random()}`;
  });
}, 5000);
// Testing for sending patch This will be Event
app.get('/patches.pushed', (req: any, res: any) => {
  // dataStore.push({ op: 'add', path: '/foo', value: `bar-${Math.random()}` });
  res.send('Hello World!');
});
