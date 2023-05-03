const http = () => ` 
{
  name: // **--- Cron Name ---**,
  cronTime: // **--- Cron Schedule ---**,
  onTick: async function(){
    try {
      const response = await axios({
        method: // **--- Webhook Method ---**,
        url: // **--- Webhook URL ---**,
        data: // **--- Webhook Data ---**,
      });
      return response.data;
    } catch (err) {
      return err.message;
    }
  },
  runOnInit: async function () {
    console.log("// **--- Cron Name ---** Job is created");
  },
},

 `;

const internal = () => ` 
{
  name: // **--- Cron Name ---**,
  cronTime: // **--- Cron Schedule ---**,
  onTick: async function(){
    try {
      const response = await this.getLocalService("crons").actions.**--- Action CallMethod ---**(**--- Cron Data ---**);
      return response.data;
    } catch (err) {
      return err.message;
    }
  },
  runOnInit: async function () {
    console.log("// **--- Cron Name ---** Job is created");
  },
},

 `;

let template = {
  http,
  internal,
};
export default template;
