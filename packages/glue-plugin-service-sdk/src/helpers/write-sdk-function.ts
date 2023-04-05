export default function writeSDKFunction(
  functionName: string,
  paramsArray: Array<string>
) {
  let functionString = `
  async ${functionName}(${paramsArray.join(":any, ")}:any): Promise<any> {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3003/api/functions/${functionName}",
        data: {${paramsArray.join(",")}},
      });
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
  `;
  return functionString;
}
