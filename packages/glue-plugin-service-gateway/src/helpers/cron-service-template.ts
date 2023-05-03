const template = () =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */
 const Cron = require("moleculer-cron");
 const axios = require("axios");

 module.exports = {
   name: "crons",
   mixins: [Cron],

   crons: [
      // **---Add Cron Jobs Here---**
   ],

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
    // **---Add Cron Actions Here---**
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
