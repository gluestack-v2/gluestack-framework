type AnyClass<T = any> = new (...args: any[]) => T;

type ClassMap = {
	[key: string]: AnyClass;
};

// @ts-nocheck
export default class SDK {
	// providers: { [key: string]: InstanceType<AnyClass> };
	providers: Map<
		string | InstanceType<AnyClass>,
		InstanceType<AnyClass>
	>;
	_config: any;
	_env: any;

	static #instance: SDK;

	constructor() {
		// Initialization code goes here
		// console.log('ServerSDK instance initialized');
		this.providers = new Map();
	}

	get() {
		return (() => {
			var obj: Object = {
				providers: this.providers,
			};
			obj = new Proxy(obj, {
				get: (_target, prop) => {
					if (typeof prop === 'string') {
						return this.providers.get(prop);
					}
				},
			});

			return obj;
		})();
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

	getProviderInstance() {
		// console.log(this.providers, providerClass, 'in functionnn');
		// for (let provider in this.providers) {
		// 	if (this.providers[provider] instanceof providerClass) {
		// 		return this.providers[provider];
		// 	}
		// }
		// return 'No instance found';
	}

	populateProviders<T extends ClassMap>(
		localProviders: T
	): { providers: any } {
		// const providers: { [K in keyof T]: InstanceType<T[K]> } =
		// 	{} as any;

		for (const key in localProviders) {
			let provider;
			// @ts-ignore
			if (typeof localProviders[key].then === 'function') {
				// @ts-ignore
				localProviders[key].then((val) => (provider = val));
			} else {
				provider = localProviders[key];
			}
			// console.log(provider, 'provider');
			// @ts-ignore
			const providerInstance = new provider(this);
			// set for alias
			this.providers.set(key, providerInstance);

			// set class
			this.providers.set(provider, providerInstance);
		}

		// this.providers = providers;
		return { providers: this.providers };
	}

	initProviders<T extends ClassMap>(localProviders: T) {
		const { providers } = this.populateProviders(localProviders);

		// for (const key in providers) {
		// 	const provider = providers[key];
		// 	provider.init();
		// }

		return providers;
	}

	async destroyProviders() {
		// await this.destroyPluginInstances();
		// for (const plugin of this.plugins) {
		// 	await plugin.destroy();
		// }
	}

	// @API: getPluginByName
	getProviderByName() {
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
		// console.log('>> init');
		await this.initProviders(localProviders);
	}

	updateConfig(config: any) {
		this._config = config;
	}

	updateEnv(env: any) {
		this._env = env;
	}

	get env() {
		return this._env;
	}

	get config() {
		return this._config;
	}

	// **** Add getter functions after this comment ****
}
