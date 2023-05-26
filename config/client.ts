import FunctionsSDK from '@project/functions-sdk';

export const config = {
  providers: {
    auth: () => {
      console.log('Client sdk');
    },
    functionsTest: FunctionsSDK,
  },
};
