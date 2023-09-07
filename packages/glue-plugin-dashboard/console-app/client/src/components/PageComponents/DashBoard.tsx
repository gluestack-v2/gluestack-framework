import React from 'react';
import { GlobalContext } from '../../utils/context/globalContext';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { HStack, VStack, Heading, Button } from '@components';
import NextImage from 'next/image';

import Link from 'next/link';
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
        px="$8"
        borderColor="$borderLight800"
        borderBottomWidth={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <NextImage
          alt="ui logo"
          src="/icons/gluestack-icon.svg"
          width={153}
          height={28}
        />
        <HStack
          alignItems="center"
          sx={{
            _web: {
              gap: 15,
            },
          }}
        >
          <Link
            href="https://framework-v2.gluestack.io/docs/getting-started/installation"
            target="_blank"
            style={{
              textDecoration: 'none',
            }}
          >
            <Button size="sm" rounded="$full">
              <Button.Text color="$white">Docs</Button.Text>
            </Button>
          </Link>
          <Link
            href="https://framework-v2.gluestack.io/docs/getting-started/installation"
            target="_blank"
            style={{
              textDecoration: 'none',
            }}
          >
            <NextImage
              alt="github logo"
              src="/icons/github-dark.svg"
              width={30}
              height={30}
            />
          </Link>
          <Link
            href="https://framework-v2.gluestack.io/docs/getting-started/installation"
            target="_blank"
            style={{
              textDecoration: 'none',
            }}
          >
            <NextImage
              alt="discord logo"
              src="/icons/discord-dark.svg"
              width={30}
              height={30}
            />
          </Link>
        </HStack>
      </HStack>
      <HStack flex={1}>
        <Sidebar />
        <MainContent runner={state?.runners?.[`${currentRunner}`]} />
      </HStack>
    </VStack>
  );
};
