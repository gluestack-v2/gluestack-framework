(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.injectPluginInstanceStore = exports.injectPluginStore = exports.getPluginInstanceStorePath = exports.getPluginStorePath = void 0;
    const getPluginStorePath = (pluginName) => {
        return `${process.cwd()}/.glue/internals/store/${pluginName}/index.json`;
    };
    exports.getPluginStorePath = getPluginStorePath;
    const getPluginInstanceStorePath = (instanceName, pluginName) => {
        return `${process.cwd()}/.glue/internals/store/${pluginName}/${instanceName}.json`;
    };
    exports.getPluginInstanceStorePath = getPluginInstanceStorePath;
    const injectPluginStore = (app, pluginName) => {
        const store = app.gluePluginStoreFactory.createPluginStoreInstance((0, exports.getPluginStorePath)(pluginName));
        store.restore();
        return store;
    };
    exports.injectPluginStore = injectPluginStore;
    const injectPluginInstanceStore = (app, pluginName, instanceName) => {
        const store = app.gluePluginStoreFactory.createPluginStoreInstance((0, exports.getPluginInstanceStorePath)(instanceName, pluginName));
        store.restore();
        return store;
    };
    exports.injectPluginInstanceStore = injectPluginInstanceStore;
});
