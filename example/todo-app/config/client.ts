import functionSDK from '@project/functions-client-sdk';
import dbClient from '@project/db-client-sdk';

export const config = {
  providers: {
    functions: functionSDK,
    functionsTest: functionSDK,
    db1: dbClient,
  },
};
