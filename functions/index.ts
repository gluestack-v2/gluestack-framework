
import axios from "axios";

export class SDK {
  constructor() {}

  "add"=
  (a:any, b : any)=>{
    return new Promise(async (resolve: any, reject: any) => {
      // Your async function code here
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:3003/api/add",
          data: {a,b },
        });

        resolve(response.data);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  ,"sub":
  (a:any, b : any)=>{
    return new Promise(async (resolve: any, reject: any) => {
      // Your async function code here
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:3003/api/sub",
          data: {a,b },
        });

        resolve(response.data);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  
}
