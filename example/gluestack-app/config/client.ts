import functionsClient from '@project/functions-client-sdk';
import dbclientClient from '@project/dbclient-client-sdk';

export const config = {
  providers: {
    functions: functionsClient,
    dbclient: dbclientClient,
    db8: dbclientClient,
  },
};
