export const eventsTemplate = () => {
  return `/**
* @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
* @typedef {import('moleculer').Context} Context Moleculer's Context
*/

/** @type {ServiceSchema} */

const eventListeners = require("../events/listener");

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
       return this.emit(ctx.params);
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
   emit(data) {
     console.log(data, eventListeners, "in events.emit");
     return data;
     if (data.eventName === "user.created") {
     }
     /**
      * const data = {
      *  event: 'user.created',
      *  params: {
      *    name: 'John Doe',
      *    email: 'jdoe@example.com'
      *  }
      * };
      */

     const listeners = eventListeners.listeners["user.updated"];

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
