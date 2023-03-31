var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PluginInstance = void 0;
    const gluestack_plugin_instance_1 = __importDefault(require("@gluestack-v2/framework-cli/build/types/gluestack-plugin-instance"));
    class PluginInstance extends gluestack_plugin_instance_1.default {
        constructor(app, callerPlugin, name, gluePluginStore, installationPath) {
            super(app, callerPlugin, name, gluePluginStore, installationPath);
            this.isOfTypeInstance = false;
            this.app = app;
            this.name = name;
            this.callerPlugin = callerPlugin;
            this.gluePluginStore = gluePluginStore;
            this.installationPath = installationPath;
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
    }
    exports.PluginInstance = PluginInstance;
});
