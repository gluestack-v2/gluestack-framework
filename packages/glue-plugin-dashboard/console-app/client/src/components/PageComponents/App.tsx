import React, { useEffect, createContext } from 'react';
import io from 'socket.io-client';
import { DataStore } from '../../utils/DataStore';
import { DashBoard } from './DashBoard';
import { GlobalContext } from '../../utils/context/globalContext';

// Socket Connection and DataStore Initialization
const socket = io('http://localhost:8080', {
  autoConnect: false,
});

// DataStore Initialization
const dataStore = DataStore.getInstance();

export const App = () => {
  const [state, setState] = React.useState({});
  const [currentRunner, setCurrentRunner] = React.useState('main');
  useEffect(() => {
    socket.connect();
    // DataStore Events
    dataStore.on('patches.pushed', (patch: any) => {
      console.log('patches.pushed');
      //Emit Patch to the client
      setState((_prev) => {
        console.log(dataStore.getValue(), 'state');
        return dataStore.getValue();
      });
    });
    // Socket handshake Events
    socket.on('handshake', (patches) => {
      console.log('Incoming Initial handshake', patches);
      dataStore.hydrate(patches);
    });

    // Socket Events for patches
    socket.on('patches.pushed', (patches) => {
      console.log('patch', patches);
      dataStore.push(patches);
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        state,
        currentRunner,
        setCurrentRunner,
        socket,
      }}
    >
      <DashBoard />
    </GlobalContext.Provider>
  );
};
