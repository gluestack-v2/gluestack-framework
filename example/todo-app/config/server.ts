// import functionSDK from '@project/functions-sdk';
import dbClient from '@project/db-server-sdk';

export const config = {
  providers: {
    db: dbClient,
  },
};
