const template = () =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */

 const { PrismaClient } = require('@prisma/client');
 const { default: ServerSDK } = require('@project/server-sdk');
 const { default: DbServerSDK } = require('@project/db-client-server-sdk');

 module.exports = {
   name: "dbclient",

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
   created() {
    ServerSDK.providers.get(DbServerSDK).setDbClient(new PrismaClient());
   },
 
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
