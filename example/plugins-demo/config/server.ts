import storageclientServer from "@project/storageclient-server-sdk";
import dbclientServer from "@project/dbclient-server-sdk";

export const config = {
  providers: {
    storageclient: storageclientServer,

    dbclient: dbclientServer,
  },
};
