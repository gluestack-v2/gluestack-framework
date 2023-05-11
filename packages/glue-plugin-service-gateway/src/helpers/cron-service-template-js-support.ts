const template = (instanceName: string) =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */
 const Cron = require("moleculer-cron");
 const axios = require("axios");
 const crons = require("../${instanceName}");
 const Context = require("../Context");
 
 function getCamelCaseName(name) {
   // clean up the name
   if (name.split("/")[0] === "") {
     let nameArr = name.split("/");
     nameArr.splice(0, 1);
     name = nameArr.join("/");
   }
   return name
     .split("/")
     .map(
       (word, ind) =>
         (ind !== 0 ? word[0]?.toUpperCase() : word[0]?.toLowerCase()) +
         word.slice(1)
     )
     .join("");
 }
 
 let localServiceActionHandlers = {};
 let cronJobs = crons.map((cron) => {
   let { name, schedule, path, ...restProps } = cron;
   let method = "post";
   if (restProps.method) {
     method = restProps.method;
   }
   let data = {};
   if (restProps.data) {
     data = restProps.data;
   }
   let cronActionName = getCamelCaseName(path) + "Action";
   let cronObj = {};
   if (!path.startsWith("http")) {
     cronObj = {
       name: name,
       cronTime: schedule,
       onTick: async function () {
         this.getLocalService("crons")
           .actions[cronActionName]()
           .then((data) => {
             console.log(name, " Response => ", data);
           });
       },
     };
   } else {
     cronObj = {
       name: name,
       cronTime: schedule,
       onTick: async () => {
         let response = await axios({
           method: method,
           url: path,
           data: data,
         });
         return response;
       },
     };
   }
 
   return cronObj;
 });
 
 crons.forEach((cron) => {
   let { name, path, ...restProps } = cron;
   let data = {};
   if (restProps.data) {
     data = restProps.data;
   }
   if (!path.startsWith("http")) {
     let actionName = getCamelCaseName(path) + "Action";
     let serviceName = path.split("/").join(".").slice(1);
     if (!localServiceActionHandlers[actionName]) {
       localServiceActionHandlers[actionName] = {};
     }
     localServiceActionHandlers[actionName]["handler"] = async (ctx) => {
       const context = new Context(ctx);
       return context._molecularCtx.call(serviceName, data).then((res) => {
         return res;
       });
     };
   }
 });
 
 module.exports = {
   name: "crons",
   mixins: [Cron],
   crons: cronJobs,
 
   /**
    * Settings
    */
   settings: {},
 
   /**
    * Dependencies
    */
   dependencies: [],
 
   /**
    * Actions
    */
   actions: {
     ...localServiceActionHandlers,
   },
 
   /**
    * Events
    */
   events: {},
 
   /**
    * Methods
    */
   methods: {},
 
   /**
    * Service created lifecycle event handler
    */
   created() {},
 
   /**
    * Service started lifecycle event handler
    */
   async started() {},
 
   /**
    * Service stopped lifecycle event handler
    */
   async stopped() {},
 };
 
 `;

export default template;
