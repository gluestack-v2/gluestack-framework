import React, { useContext } from 'react';
import { VStack } from '@components';
import { GlobalContext } from '@/utils/context/globalContext';
import { Commands, OutPut } from './MainContent';

export const DashBoardContent = () => {
  const { socket, state } = useContext(GlobalContext);

  console.log(state?.runners?.main?.output, 'state');
  const handlePress = (service: string) => {
    socket.emit('run.command', { service: service, command: 'down' });
  };
  return (
    <VStack
      sx={{
        _web: {
          gap: 10,
        },
      }}
      flex={1}
      overflow="hidden"
    >
      <VStack flex={1}>
        <Commands
          commands={state?.runners?.main?.commands}
          service={state?.runners?.main?.name}
        />
        <OutPut output={state?.runners?.main?.output} />
      </VStack>
    </VStack>
  );
};
