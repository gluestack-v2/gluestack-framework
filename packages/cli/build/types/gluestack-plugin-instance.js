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
    class BaseGluestackPluginInstance {
        constructor(app, callerPlugin, name, gluePluginStore, installationPath) {
            this.isOfTypeInstance = false;
            this.app = app;
            this.name = name;
            this.callerPlugin = callerPlugin;
            this.gluePluginStore = gluePluginStore;
            this.installationPath = installationPath;
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
    }
    exports.default = BaseGluestackPluginInstance;
});
