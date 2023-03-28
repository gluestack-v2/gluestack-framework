(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./PluginInstanceContainerController"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PluginInstance = void 0;
    const PluginInstanceContainerController_1 = require("./PluginInstanceContainerController");
    class PluginInstance {
        constructor(app, callerPlugin, name, gluePluginStore, installationPath) {
            this.isOfTypeInstance = false;
            this.app = app;
            this.name = name;
            this.callerPlugin = callerPlugin;
            this.gluePluginStore = gluePluginStore;
            this.installationPath = installationPath;
            // @ts-ignore
            this.containerController = new PluginInstanceContainerController_1.PluginInstanceContainerController(app, this);
        }
        init() {
            //
        }
        destroy() {
            //
        }
        getName() {
            return this.name;
        }
        getCallerPlugin() {
            return this.callerPlugin;
        }
        getInstallationPath() {
            return this.installationPath;
        }
        watch() {
            return [
                'pages',
                'public',
                'styles',
                'components'
            ];
        }
        getContainerController() {
            return this.containerController;
        }
    }
    exports.PluginInstance = PluginInstance;
});
