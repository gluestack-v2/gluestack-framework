import { createContext } from 'react';
interface IState {
  services?: any[];
  runners?: {
    [key: string]: {
      name: string;
      commands: Array<string>;
      output: string;
      status?: 'up' | 'down' | undefined;
    };
  };
}

interface IGlobalContext {
  state: IState;
  currentRunner: string;
  setCurrentRunner: (runner: any) => void;
  socket: any;
}
export const GlobalContext = createContext<IGlobalContext>({
  state: {},
  currentRunner: 'Runner 1',
  setCurrentRunner: (runner: any) => {},
  socket: {} as any,
});
