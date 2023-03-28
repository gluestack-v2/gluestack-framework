export = GluePluginStoreFactory;
declare class GluePluginStoreFactory {
    stores: any[];
    createPluginStoreInstance(path: any): any;
    saveAllStores(): void;
}
