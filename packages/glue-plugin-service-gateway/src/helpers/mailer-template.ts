const template = () =>
  `/**
  * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
  * @typedef {import('moleculer').Context} Context Moleculer's Context
  */
 
 /** @type {ServiceSchema} */
 const axios = require("axios");
 const nodemailer = require('nodemailer');
 const ServerSDK = require("../ServerSdk.ts");

 

 module.exports = {
   name: "mailer",

   crons: [],

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
   actions: {},
 
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
   async created() {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT || '587',
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILER_USER, // generated ethereal user
          pass: process.env.MAILER_PASSWORD, // generated ethereal password
        },
    });

    const sdk = ServerSDK.getInstance();
    sdk.transporter = transporter;
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
