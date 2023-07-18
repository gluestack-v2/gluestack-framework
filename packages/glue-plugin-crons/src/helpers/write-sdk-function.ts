export default function writeSDKFunction(
  functionName: string,
  paramsArray: Array<string>,
  functionPath: string
) {
  let functionString = `
  async ${functionName}(${paramsArray.join(':any, ')}:any): Promise<any> {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3003/api${functionPath}",
        data: {${paramsArray.join(',')}},
      });
      return response.data;
    } catch (err: any) {
      return err.message;
    }
  }
  `;
  return functionString;
}
