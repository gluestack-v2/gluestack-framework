import functionSDK from '@project/functions-client-sdk';
import dbClient from '@project/dbclient-client-sdk';

export const config = {
  providers: {
    functions: functionSDK,
    db: dbClient,
  },
};
