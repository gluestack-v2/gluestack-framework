module.exports = {
  "functions.add": async (next, serverSDK) => {
    //before operation
    console.log("before operation");
    next(serverSDK)
      .then((res) => {
        //response operation
        console.log("response operation");
      })
      .catch((err) => {
        //error operation
        console.log("error returned => ", err);
      });
  },
};
