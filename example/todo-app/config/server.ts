import functionSDK from '@project/functions-sdk';
import dbClient from '@project/dbclient-server-sdk';

export const config = {
  providers: {
    functionSDK: functionSDK,
    dbClient: dbClient,
  },
};