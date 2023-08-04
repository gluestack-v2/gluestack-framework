import { VStack, Button, Text, Pressable, Heading } from '@components';
import type { state } from './DashBoard';
import { GlobalContext } from '@/utils/context/globalContext';
import { useContext } from 'react';
export const Sidebar = ({ state: newState }: { state: state }) => {
  const { setCurrentRunner, state, currentRunner } = useContext(GlobalContext);
  return (
    <VStack
      w="$56"
      h="$full"
      px="$4"
      justifyContent="flex-start"
      sx={{
        _web: {
          gap: 10,
        },
      }}
    >
      <Heading size="sm" color="$primary500">
        List of Running services
      </Heading>
      {state?.runners &&
        Object.keys(state?.runners).map((runner) => {
          return (
            <Runner
              runner={runner}
              runnerObject={state?.runners?.[runner]}
              setCurrentRunner={setCurrentRunner}
              currentRunner={currentRunner}
            />
          );
        })}
    </VStack>
  );
};

const Runner = ({
  runner,
  setCurrentRunner,
  runnerObject,
  currentRunner,
}: {
  runner: string;
  setCurrentRunner: (runner: any) => void;
  currentRunner: string;
  runnerObject: {
    status: string;
    output: string;
  };
}) => {
  return (
    <Pressable
      flexDirection="row"
      justifyContent="space-around"
      rounded="$full"
      alignItems="center"
      bg={currentRunner !== runner ? '$black' : '$purple500'}
      h="$10"
      sx={{
        ':hover': {
          bg: '$purple600',
        },
      }}
      onPress={() => {
        setCurrentRunner && setCurrentRunner(runner);
      }}
      key={runner}
    >
      <Button.Text textAlign="center">{runner}</Button.Text>
      <Button.Text textAlign="center">{runnerObject?.status}</Button.Text>
    </Pressable>
  );
};
