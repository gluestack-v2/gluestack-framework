import React, { use, useEffect, createContext } from 'react';
import io from 'socket.io-client';
import DataStore from './DataStore';
// Socket Connection and DataStore Initialization

const socket = io('http://localhost:3001', {
  autoConnect: false,
});

//Context
const GlobalContext = createContext({
  state: {},
});
const dataStore = new DataStore();

const RunnerName = React.memo(({ name, ...props }) => {
  useEffect(() => {
    console.log('RunnerName useEffect', name);
  }, []);
  return <code>{name}</code>;
});

const ShowCommands = React.memo((commands: any[]) => {
  return <code>{JSON.stringify(commands)}</code>;
  //   return (
  //     <ul>
  //       {commands.map((command) => {
  //         return <li>{command}</li>;
  //       })}
  //     </ul>
  //   );
});

const RunnerRenderer = React.memo(({ runner }) => {
  return <div>Runner name: {runner.name}</div>;
});

const App = () => {
  const { state } = React.useContext(GlobalContext);
  return <SubApp state={state} />;
};

const SubApp = React.memo(({ state }) => {
  if (!state && !state.runners && !Array.isArray(state.runners)) return null;
  //   return <RunnerName name="hello" />;
  return (
    <>
      {Array.isArray(state.runners) &&
        state.runners.map((runner, key) => {
          return (
            <>
              <RunnerRenderer runner={runner} key={key} />
            </>
          );
        })}
    </>
  );
});

export const Example = () => {
  useEffect(() => {
    socket.connect();

    // DataStore Events
    dataStore.on('patches.pushed', (patch: any) => {
      console.log('patches.pushed');
      //Emit Patch to the client

      if (typeof window != 'undefined') {
        if (!window.values) window.values = [];

        window.values.push(dataStore.getValue());
      }

      setState(dataStore.getValue());
    });

    // Socket Events
    socket.on('handshake', (patches) => {
      console.log('Incoming Initial handshake', patches);
      dataStore.hydrate(patches);
    });
    socket.on('patches.pushed', (patches) => {
      console.log('patch', patches);
      dataStore.push(patches);
    });

    console.log('dataStore UseEffect', dataStore.getPatches());
  }, []);

  const [state, setState] = React.useState({});
  return (
    <GlobalContext.Provider
      value={{
        state,
      }}
    >
      <App />
    </GlobalContext.Provider>
  );
};
