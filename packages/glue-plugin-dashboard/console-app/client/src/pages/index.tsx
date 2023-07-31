import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { Example } from '@/components/Example';

export default function Home() {
  const [rootObject, setRootObject] = React.useState({});
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
      <>
        <Example />
      </>
    </main>
  );
}
