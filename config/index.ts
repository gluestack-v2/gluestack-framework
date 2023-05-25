// import { env } from "@gluestack/core";

export const config = {
  providers: {
    functions: () => {
      console.log('Global sdk');
    },
  },
  // "name": env('NAME', "my-app"),
};

// config('config.providers.functions')
// config('config.')

// clientSDK.providers.functions.add();
