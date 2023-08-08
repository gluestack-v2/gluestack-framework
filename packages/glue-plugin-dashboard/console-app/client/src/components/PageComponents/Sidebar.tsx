import { VStack, Button, Text, Pressable, Heading } from '@components';
import type { state } from './DashBoard';
import { GlobalContext } from '@/utils/context/globalContext';
import { useContext } from 'react';
import { Play, Square, StopCircle } from 'lucide-react';

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
        Services
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
  console.log('🚀 ~ runnerObject:', runnerObject);
  const isActive = currentRunner === runner;
  const { socket } = useContext(GlobalContext);
  const handlePress = (command: string) => {
    socket.emit('run.command', { command: command, service: runner });
  };
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
          _icon: {
            color: '$backgroundDark200',
          },
        },
        '_icon': {
          color: '$backgroundDark100',
        },
        ':active': {
          _icon: {
            color: '$backgroundDark300',
          },
        },
      }}
      h="$10"
      onPress={() => {
        setCurrentRunner && setCurrentRunner(runner);
      }}
      key={runner}
      justifyContent="space-between"
    >
      <Button.Text>{runner}</Button.Text>
      {runner === 'main' ? null : (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handlePress(runnerObject?.status === 'up' ? 'down' : 'up');
          }}
        >
          {({ hovered, pressed }) => {
            console.log('🚀 ~ hovered, isHovered', hovered, pressed);
            const color = pressed
              ? '$backgroundDark400'
              : hovered
              ? '$backgroundDark400'
              : '$backgroundDark100';
            return (
              <Button.Icon
                color={color}
                size={16}
                fill="currentColor"
                as={runnerObject?.status === 'up' ? Square : Play}
              />
            );
          }}
        </Pressable>
      )}
    </Pressable>
  );
};
