import { VStack, Button, Text, Pressable, Heading } from '@components';
import type { state } from './DashBoard';
import { GlobalContext } from '@/utils/context/globalContext';
import { useContext } from 'react';
export const Sidebar = ({ state: newState }: { state: state }) => {
  const { setCurrentRunner, state, currentRunner } = useContext(GlobalContext);
  return (
    <VStack
      pt={56}
      w={250}
      h="$full"
      px="$4"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        _web: {
          gap: 10,
        },
      }}
      borderColor="$borderLight800"
      borderRightWidth={1}
    >
      <Heading size="md" color="$white" w="100%">
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
  const isActive = currentRunner === runner;
  return (
    <Pressable
      w="100%"
      flexDirection="row"
      rounded="$lg"
      px="$4"
      py="$4"
      alignItems="center"
      sx={{
        'bg': isActive ? '$primary600_alpha_50' : undefined,
        ':hover': {
          bg: '$primary600_alpha_30',
        },
      }}
      h="$10"
      onPress={() => {
        setCurrentRunner && setCurrentRunner(runner);
      }}
      key={runner}
    >
      <Button.Text>{runner}</Button.Text>
      <Button.Text>{runnerObject?.status}</Button.Text>
    </Pressable>
  );
};
