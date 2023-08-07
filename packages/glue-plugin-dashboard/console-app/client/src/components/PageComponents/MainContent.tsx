import { HStack, VStack, Button, Text, Box, Pressable } from '@components';
import { state } from './DashBoard';
import { use, useContext } from 'react';
import { GlobalContext } from '@/utils/context/globalContext';
import { DashBoardContent } from './DashBoardContent';
import { TerminalContextProvider, ReactTerminal } from 'react-terminal';
import React from 'react';

export const MainContent = React.memo(
  ({
    runner,
  }: {
    runner: {
      name: string;
      status: string;
      output: string;
      commands: Array<string>;
    };
  }) => {
    if (runner?.name === 'main') {
      return <DashBoardContent />;
    }
    return (
      <VStack flex={1}>
        <Commands commands={runner?.commands} service={runner?.name} />
        <OutPut output={runner?.output} />
      </VStack>
    );
  }
);

export const Commands = React.memo(
  ({ commands, service }: { commands: Array<string>; service: string }) => {
    const handleClear = () => {};

    return (
      <HStack justifyContent="center" alignItems="center" mt={40}>
        <HStack
          px={20}
          py={10}
          justifyContent="center"
          alignItems="center"
          rounded="$lg"
          bg="$primary100_alpha_30"
          sx={{
            _web: {
              gap: 10,
            },
          }}
        >
          {commands?.map((command) => {
            return (
              <Command command={command} key={command} service={service} />
            );
          })}
        </HStack>
      </HStack>
    );
  }
);

const Command = React.memo(
  ({ command, service }: { command: string; service: string }) => {
    const { socket } = useContext(GlobalContext);
    const handlePress = (command: string) => {
      socket.emit('run.command', { command: command, service: service });
    };
    return (
      <>
        <Pressable
          sx={{
            'bg': '$primary600_alpha_50',
            ':hover': {
              bg: '$primary600_alpha_30',
            },
          }}
          onPress={() => handlePress(command)}
          rounded="$full"
          width={96}
          height={30}
          justifyContent="center"
          alignItems="center"
        >
          <Text
            size="sm"
            textAlign="center"
            color="$textLight100"
            textTransform="capitalize"
          >
            {command}
          </Text>
        </Pressable>
      </>
    );
  }
);

export const OutPut = ({ output }: { output: string }) => {
  const bottomEl = React.useRef(null);
  React.useEffect(() => {
    console.log('scrolling');
    bottomEl?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [output]);

  const convertColorCodesToHTML = (text: string) => {
    const colorMap = {
      '[30m': '<span style="color:black">',
      '[31m': '<span style="color:red">',
      '[32m': '<span style="color:lime">',
      '[33m': '<span style="color:yellow">',
      '[34m': '<span style="color:blue">',
      '[35m': '<span style="color:magenta">',
      '[36m': '<span style="color:cyan">',
      '[37m': '<span style="color:white">',
      '[39m': '</span>',
      '[90m': '<span style="color:gray">',
    };

    const linkPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const pattern = /\[\d+m|https?:\/\/[^\s/$.?#].[^\s]*|/g;

    const replacedText = text.replace(pattern, (match) => {
      if (match in colorMap) {
        return colorMap[match];
      } else if (linkPattern.test(match)) {
        console.log(match, 'match');
        return `<a href="${match}" style="color:magenta" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
      return match;
    });

    return replacedText;
  };

  const coloredHTML = convertColorCodesToHTML(output ?? '');
  return (
    <VStack
      p="$10"
      // bg="#f1a031"
      // borderWidth={2}
      borderColor="$trueGray600"
      flex={1}
    >
      <HStack
        borderTopLeftRadius="$lg"
        borderTopRightRadius="$lg"
        py="$3"
        flex={1}
        bg="#131519"
        alignItems="center"
        sx={{
          gap: 8,
        }}
        pl="$4"
      >
        <Box bg="#fc5b57" w="$3" h="$3" rounded="$full" />
        <Box bg="#e5bf3c" w="$3" h="$3" rounded="$full" />
        <Box bg="#57c038" w="$3" h="$3" rounded="$full" />
      </HStack>
      <Box
        bg="#022833"
        p="$4"
        sx={{
          _web: {
            overflow: 'auto',
            height: '100%',
          },
        }}
        pt={10}
        borderBottomLeftRadius="$lg"
        borderBottomRightRadius="$lg"
        nativeID="outputContainer"
      >
        <pre
          style={{ color: '#839496', fontFamily: 'Source Code Pro' }}
          dangerouslySetInnerHTML={{ __html: coloredHTML }}
        ></pre>
        <div ref={bottomEl} />
      </Box>
    </VStack>
  );
};
