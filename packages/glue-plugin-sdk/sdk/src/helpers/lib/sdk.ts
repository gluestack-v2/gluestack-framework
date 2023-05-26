type AnyClass<T = any> = new (...args: any[]) => T;

type ClassMap = {
	[key: string]: AnyClass;
};

// @ts-nocheck
export default class SDK {
	providers: { [key: string]: InstanceType<AnyClass> };
	static #instance: SDK;

	constructor() {
		// Initialization code goes here
		console.log('ServerSDK instance initialized');
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

	populateProviders<T extends ClassMap>(
		localProviders: T
	): { providers: { [K in keyof T]: InstanceType<T[K]> } } {
		const providers: { [K in keyof T]: InstanceType<T[K]> } =
			{} as any;

		for (const key in localProviders) {
			const provider = new localProviders[key]();
			providers[key] = provider;
		}
		return { providers };
	}

	initProviders<T extends ClassMap>(localProviders: T) {
		let { providers } = this.populateProviders(localProviders);

		for (const key in providers) {
			const provider = providers[key];
			provider.init();
		}
		return providers;
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
