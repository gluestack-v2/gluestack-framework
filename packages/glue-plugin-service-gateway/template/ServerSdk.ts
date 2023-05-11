// @ts-nocheck
class ServerSDK {
	minioClient; // storageClient
	prismaClient; // databaseClient

	static #instance = null;

	constructor() {
		// Initialization code goes here
		console.log("ServerSDK instance initialized");
	}

	static getInstance() {
		if (!ServerSDK.#instance) {
			ServerSDK.#instance = new ServerSDK();
		}
		return ServerSDK.#instance;
	}

	someMethod() {
		// ServerSDK methods
	}
}

module.exports = ServerSDK;
