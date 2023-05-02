const template = (instanceName: string) =>
  `/**
	* @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
	* @typedef {import('moleculer').Context} Context Moleculer's Context
	*/
 
 /** @type {ServiceSchema} */
 
 // ***---Add Imports Here---***
 const QueueService = require("moleculer-bee-queue");
 
 module.exports = {
	 name: "queues",
	 mixins: [QueueService()],
 
	 queues: {
		 async "queue.push"(job) {
			 this.logger.info("New job received!");
			 const { functionName, params } = job.data;
			 try {
				 await this.broker.call(functionName, params);
				 return this.Promise.resolve({
					 done: true,
					 id: job.data.id,
					 worker: process.pid,
				 });
			 } catch (error) {
				 job.error(error);
				 return this.Promise.reject(error);
			 }
		 },
	 },
 
	 /**
		* Actions
		*/
	 actions: {
		 async push(data) {
			 let userParams = data?.params?.data;
			 console.log(userParams);
			 if (
				 userParams &&
				 userParams.hasOwnProperty("functionName") &&
				 userParams.hasOwnProperty("params")
			 ) {
				 /**
					* const payload = {
					*  functionName: 'functions/create-user',
					*  params: {
					*    name: 'John Doe',
					*    email: 'jdoe@example.com'
					*  }
					* };
					*/
				 const queue = this.getQueue("queue.push");
 
				 // Create a job and add it to the queue
				 const job = await queue.createJob(userParams);
				 job.on("progress", (progress) => {
					 this.logger.info(
						 "Job #" + job.id + " progress is " + progress + "%"
					 );
				 });
				 job.on("succeeded", (res) => {
					 this.logger.info(
						 "Job #" + job.id + " completed!. Result:",
						 res
					 );
				 });
				 job.retries(2).save();
			 } else {
				 this.logger.error("Body does not have functionName or params");
			 }
		 },
	 },
 };
`;

export default template;
