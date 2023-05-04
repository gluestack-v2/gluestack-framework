export const eventsTemplate = () => {
  return `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */
 
 const eventListeners = require("../events/listeners");
 const Ctx = require("../Context");
 
 module.exports = {
   name: "events",
 
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
     emit: {
       handler(ctx) {
         return this.emit(ctx);
       },
     },
   },
 
   /**
    * Events
    */
   events: {
     // **---Add Events Here---**
   },
 
   /**
    * Methods
    */
   methods: {
     emit(ctx) {
       let data = ctx.params;
       let actionsArr = [];
 
       eventListeners.map((listener) => {
         const eventName = Object.keys(listener)[0];
         const currentListeners = listener[eventName];
         currentListeners.map((ctxCallPath) => {
           const serverSdk = new Ctx(ctx);
           const finalPath = ctxCallPath.split("/").join(".");
 
           if (eventName == data.eventName) {
             actionsArr.push({
               action: finalPath,
               params: serverSdk.params,
             });
           }
         });
       });
 
       return ctx.mcall(actionsArr);
 
       /**
        * const data = {
        *  event: 'user.created',
        *  params: {
        *    name: 'John Doe',
        *    email: 'jdoe@example.com'
        *  }
        * };
        */
 
       // const listeners = eventListeners.listeners["user.updated"];
 
       // for await(const listener of listeners) {
       //    await broker.call(listener, data);
       // }
     },
     testFunction(data) {
       console.log(data.params);
     },
   },
 
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
};
