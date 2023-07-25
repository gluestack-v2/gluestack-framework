'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useTransition, useState } from 'react';
import { logScript } from '../actions/action';
import { Sidebar } from '@/components/Sidebar';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [sidebarJson, setRawElement] = useState<string>('');
  const logScriptAction = () => {
    logScript().then((res) => {
      console.log(res, 'res');
      setRawElement(res);
    });
  };
  useEffect(() => {
    startTransition(logScriptAction);
  }, []);
  return (
    <html lang="en">
      <body className={(inter.className, 'flex items-start')}>
        {!isPending && <Sidebar sidebarJson={sidebarJson} />}
        {children}
      </body>
    </html>
  );
}
