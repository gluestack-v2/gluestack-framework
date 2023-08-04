import React from 'react';
import { GlobalContext } from '../../utils/context/globalContext';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { HStack } from '@components';
type runnerObject = {
  status: string;
  output: string;
  commands: Array<string>;
};
export interface state {
  runners: {
    [key: string]: runnerObject;
  };
}
export const DashBoard = () => {
  const { state, currentRunner } = React.useContext(GlobalContext);

  return (
    <HStack
      sx={{
        pt: '$10',
        _web: {
          gap: 50,
        },
        height: '100vh',
      }}
    >
      <Sidebar state={state} />
      <MainContent runner={state?.runners?.[`${currentRunner}`]} />
    </HStack>
  );
};
