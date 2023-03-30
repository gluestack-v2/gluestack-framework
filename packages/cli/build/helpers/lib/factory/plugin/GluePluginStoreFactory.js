var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash", "../../store/GluePluginStore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const lodash_1 = require("lodash");
    const GluePluginStore_1 = __importDefault(require("../../store/GluePluginStore"));
    class GluePluginStoreFactory {
        constructor() {
            this.stores = [];
        }
        createPluginStoreInstance(path) {
            const loadedStore = (0, lodash_1.find)(this.stores, {
                path: path,
            });
            if (loadedStore)
                return loadedStore;
            const store = new GluePluginStore_1.default(path);
            this.stores.push(store);
            return store;
        }
        saveAllStores() {
            this.stores.forEach((store) => {
                store.save();
            });
        }
    }
    exports.default = GluePluginStoreFactory;
});
