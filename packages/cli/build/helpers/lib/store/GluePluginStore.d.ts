export = GluePluginStore;
declare class GluePluginStore {
    constructor(path: any);
    path: any;
    store: {};
    restore(): void;
    set(key: any, value: any): void;
    get(key: any): any;
    save(): void;
}
