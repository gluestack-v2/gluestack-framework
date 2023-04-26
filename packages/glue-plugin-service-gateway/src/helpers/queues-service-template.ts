const template = (instanceName: string) =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */

 /** @type {ServiceSchema} */

 // ***---Add Imports Here---***


 module.exports = {
   name: "${instanceName}",

   /**
    * Actions
    */
   actions: // ***---Add Actions Here---***,

   /**
    * Channels
    */
   channels: // ***---Add Channels Here---***,
 };
 `;

export default template;
