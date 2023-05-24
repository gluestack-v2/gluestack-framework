
import IProvider from '../../types/provider/interface/IProvider';
type ProviderConstructor = new (
	app: SDK,
) => IProvider;


// @ts-nocheck
export default class SDK {
	providers: Record<string, IProvider>;
	static #instance: SDK;

	constructor() {
		// Initialization code goes here
		console.log("ServerSDK instance initialized");
		this.providers = {};

	}

	static getInstance() {
		if (!SDK.#instance) {
			//@ts-ignore
			SDK.#instance = new SDK();
		}
		return SDK.#instance;
	}

	someMethod() {
		// ServerSDK methods
	}


	async destroyPlugins() {
		// await this.destroyPluginInstances();
		// for (const plugin of this.plugins) {
		// 	await plugin.destroy();
		// }
	}


	async populateProviders(localProviders: any) {

		for (const key in localProviders) {
			const provider = new localProviders[key]();
			this.providers[key] = provider;
		}
	}

	async initProviders(localProviders?: any) {
		await this.populateProviders(localProviders);

		for (const key in this.providers) {
			const provider = this.providers[key];
			provider.init();
		}
	}

	async destroyProviders() {
		// await this.destroyPluginInstances();
		// for (const plugin of this.plugins) {
		// 	await plugin.destroy();
		// }
	}

	// @API: getPluginByName
	getProviderByName(providerName: string) {
		// return 
		// for (const provider of this.providers) {
		// 	if (provider.getName() === providerName) {
		// 		return provider;
		// 	}
		// }
		return null;
	}

	// @API: getproviders
	getProviders() {
		return this.providers;
	}

	// @API: destroy
	async destroy() {
		// destroy all plugins
		// await this.destroyPlugins();
		// // close commander
		// this.commander.destroy();
		// // save changes made into all stores
		// this.gluePluginStoreFactory.saveAllStores();

		// this.updateServices();
	}

	// @API: init
	async init(localProviders?: any) {
		// initialise all providers
		console.log('>> init');
		await this.initProviders(localProviders);
	}

}
