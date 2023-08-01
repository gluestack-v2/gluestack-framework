module.exports = {
  'db.db': async (next, serverSDK) => {
    //before operation

    // eslint-disable-next-line no-console
    console.log('before db operation');

    next(serverSDK)
      .then((res) => {
        //response operation
        // eslint-disable-next-line no-console
        console.log('response operation');
        return res;
      })
      .catch((err) => {
        //error operation
        // eslint-disable-next-line no-console
        console.log('error returned => ', err);
        throw err;
      });
  },
};
