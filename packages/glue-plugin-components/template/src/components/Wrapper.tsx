import React from "react";

// import { useDarkMode } from '../hooks/useDarkMode';
import { Platform } from "react-native";
import { GluestackUIProvider } from "../ui-components";

// import { Center } from '../ui-components';

// import { View } from 'react-native';

const Wrapper = ({ children, ...props }: any) => {
  // let value = false;
  // if (Platform.OS === 'web') {
  // value = useDarkMode();
  // const [isDark, setIsDark] = React.useState(false);

  // function getColorMode() {
  //   if (Platform.OS === 'web') {
  //     return value ? 'dark' : 'light';
  //   } else {
  //     return isDark ? 'dark' : 'light';
  //   }
  // }

  return (
    // <Text>jhbjbk</Text>
    <GluestackUIProvider>{children}</GluestackUIProvider>
  );
};

export default Wrapper;
