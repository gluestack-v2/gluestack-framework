import * as React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
//@ts-ignore
import { AppRegistry } from 'react-native-web';
import { flush } from '@gluestack-style/react';
// import '../utils/termynal.js';
function Document() {
  return (
    <Html className="gs" lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="termynal.css" />
        <script src="/termynal.js" data-termynal-container="#termynal" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async ({ renderPage }: any) => {
  AppRegistry.registerComponent('Main', () => Main);
  const { getStyleElement } = AppRegistry.getApplication('Main');
  const page = await renderPage();
  const styles = [getStyleElement(), ...flush()];
  return { ...page, styles: React.Children.toArray(styles) };
};

export default Document;
