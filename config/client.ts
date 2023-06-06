// import FunctionsSDK from '@project/sdk-functions';
import StorageSDK from '@project/storageclient-client-sdk';
import DbClientSDK from '@project/dbclient-client-sdk';

export const config = {
  providers: {
    // functionsTest: FunctionsSDK,
    StorageSDK: StorageSDK,
    dbClientSdk: DbClientSDK,
  },
};
