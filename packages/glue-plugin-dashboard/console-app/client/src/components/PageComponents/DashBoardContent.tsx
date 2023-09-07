import React, { useContext } from 'react';
import { VStack } from '@components';
import { GlobalContext } from '@/utils/context/globalContext';
import { Commands, OutPut } from './MainContent';

export const DashBoardContent = () => {
  const { state } = useContext(GlobalContext);

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
