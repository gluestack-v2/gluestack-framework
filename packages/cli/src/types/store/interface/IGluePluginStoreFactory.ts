import IGluePluginStore from './IGluePluginStore';

export default interface IGluePluginStoreFactory {
	stores: IGluePluginStore[];

	createPluginStoreInstance(path: string): IGluePluginStore;

	saveAllStores(): void;
}
