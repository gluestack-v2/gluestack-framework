import { createContext } from 'react';
export const GlobalContext = createContext({
  state: {},
  currentRunner: 'Runner 1',
  setCurrentRunner: (runner: any) => {},
  socket: {} as any,
});
