export default function writeSDKFunction(
  functionName: string,
  paramsArray: Array<string>
) {
  let functionString = `
  async ${functionName}(${paramsArray.join(", ")}) {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3013/api/functions/${functionName}",
        data: {${paramsArray.join(",")}},
      });
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
  `;
  return functionString;
}
