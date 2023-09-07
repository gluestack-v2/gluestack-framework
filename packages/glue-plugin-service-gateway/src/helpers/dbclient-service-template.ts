const template = (instanceName: string) =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */
 
 const { PrismaClient } = require('@prisma/client');
 const { default: ServerSDK } = require('@project/server-sdk');
 const Context = require('../Context.ts');
 const { default: DbServerSDK } = require('@project/${instanceName}-server-sdk');
 
 module.exports = {
   name: '${instanceName}',
 
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
     db: {
       rest: {
         method: 'POST',
         path: '/db',
       },
       handler: async (ctx) => {
         const context = new Context(ctx);
         const { query } = ctx.params;
        //  TODO: Remove hardcoded db
         let resolvedQuery = context.sdk.providers.get(DbServerSDK).prisma;
         return new Promise((resolve, reject) => {
           let res;
           query.forEach(async (q) => {
             if (q.type === 'key') {
               resolvedQuery = resolvedQuery?.[q.key];
             }
             if (q.type === 'function') {
               arguments = q.args || {};
               if (q.args) {
                 try {
                   res = await resolvedQuery?.[q.key](arguments);
                   resolve(res);
                 } catch (err) {
                   reject(err);
                 }
               } else {
                 try {
                   res = await resolvedQuery?.[q.key]();
                   resolve(res);
                 } catch (err) {
                   reject(err);
                 }
               }
             }
           });
         });
       },
     },
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
    // TODO: Refactor to use the SDK
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
