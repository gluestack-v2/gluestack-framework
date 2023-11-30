import functionsClient from '@project/functions-client-sdk';
import dbclientClient from '@project/dbclient-client-sdk';
import storageclientClient from '@project/storageclient-client-sdk';

export const config = {
  providers: {
    functions: functionsClient,
    dbclient: dbclientClient,
    storageclient: storageclientClient,
  },
};
