export default function writeSDKFunction(
  functionName: string,
  paramsArray: Array<string>,
  functionPath: string
) {
  let functionString = `
  (${paramsArray.join(", ")})=>{
    return new Promise(async (resolve, reject) => {
      // Your async function code here
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:3003/api${functionPath}",
          data: {${paramsArray.join(",")}},
        });

        resolve(response.data);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  `;
  return functionString;
}
