/* eslint-disable react/react-in-jsx-scope */
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { GluestackUIProvider } from '../components';
import { config } from '../gluestack-ui.config';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GluestackUIProvider config={config.theme}>
      {/* @ts-ignore */}
      <Component {...pageProps} />
    </GluestackUIProvider>
  );
}
