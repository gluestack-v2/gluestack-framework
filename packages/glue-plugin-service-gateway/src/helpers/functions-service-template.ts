const template = (instanceName: string) =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */

 /** @type {ServiceSchema} */

 // **---Add Imports Here---**


 module.exports = {
   name: "${instanceName}",

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
   actions: // **---Add Actions Here---**,

   /**
    * Events
    */
   events: {
     // **---Add Events Here---**
   },

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
