import React from 'react';
import { GlobalContext } from '../../utils/context/globalContext';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { HStack, VStack } from '@components';
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
    <VStack h="100vh">
      <HStack
        h={58}
        borderColor="$borderLight800"
        borderBottomWidth={1}
      ></HStack>
      <HStack flex={1}>
        <Sidebar state={state} />
        <MainContent runner={state?.runners?.[`${currentRunner}`]} />
      </HStack>
    </VStack>
  );
};
