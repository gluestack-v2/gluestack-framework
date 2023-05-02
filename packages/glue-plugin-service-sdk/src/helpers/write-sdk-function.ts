export default function writeSDKFunction(
  functionName: string,
  paramsArray: Array<string> | [],
  functionPath: string
) {
  let functionString = `
  (${paramsArray.join(":any, ")} ${paramsArray.length > 0 && ":any"})=>{
    return new Promise(async (resolve:any, reject:any) => {
      // Your async function code here
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:3003/api${functionPath}",
          data: {${paramsArray.join(",")}},
        });

        resolve(response.data);
      } catch (error:any) {
        reject(error.message);
      }
    });
  }
  `;
  return functionString;
}
