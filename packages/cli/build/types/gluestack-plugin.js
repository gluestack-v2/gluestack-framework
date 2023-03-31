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
    class BaseGluestackPlugin {
        constructor(app, gluePluginStore) {
            this.type = 'stateless';
            this.app = app;
            this.instances = [];
            this.type = 'stateless';
            this.gluePluginStore = gluePluginStore;
        }
        getType() {
            return this.type;
        }
        getTemplateFolderPath() {
            return `${process.cwd()}/node_modules/${this.getName()}/template`;
        }
        getInstallationPath(target) {
            return `./${target}`;
        }
        getInstances() {
            return this.instances;
        }
    }
    exports.default = BaseGluestackPlugin;
});
