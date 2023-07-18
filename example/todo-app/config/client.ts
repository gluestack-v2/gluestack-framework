import functionSDK from '@project/functions-client-sdk';
import dbClient from '@project/dbclient-client-sdk';

export const config = {
  providers: {
    functionSDK: functionSDK,
    dbClient: dbClient,
  },
};
