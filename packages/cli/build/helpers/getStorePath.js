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
    function getPluginStorePath(pluginName) {
        return `${process.cwd()}/.glue/internals/store/${pluginName}/index.json`;
    }
    exports.getPluginStorePath = getPluginStorePath;
    function getPluginInstanceStorePath(instanceName, pluginName) {
        return `${process.cwd()}/.glue/internals/store/${pluginName}/${instanceName}.json`;
    }
    exports.getPluginInstanceStorePath = getPluginInstanceStorePath;
    function injectPluginStore(app, pluginName) {
        const store = app.gluePluginStoreFactory.createPluginStoreInstance(getPluginStorePath(pluginName));
        store.restore();
        return store;
    }
    exports.injectPluginStore = injectPluginStore;
    function injectPluginInstanceStore(app, pluginName, instanceName) {
        const store = app.gluePluginStoreFactory.createPluginStoreInstance(getPluginInstanceStorePath(instanceName, pluginName));
        store.restore();
        return store;
    }
    exports.injectPluginInstanceStore = injectPluginInstanceStore;
});
