var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../package.json", "./PluginInstance", "@gluestack-v2/framework-cli/build/types/gluestack-plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GlueStackPlugin = void 0;
    // @ts-ignore
    const package_json_1 = __importDefault(require("../package.json"));
    const PluginInstance_1 = require("./PluginInstance");
    const gluestack_plugin_1 = __importDefault(require("@gluestack-v2/framework-cli/build/types/gluestack-plugin"));
    // Do not edit the name of this class
    class GlueStackPlugin extends gluestack_plugin_1.default {
        constructor(app, gluePluginStore) {
            super(app, gluePluginStore);
            this.type = 'devonly';
            this.app = app;
            this.instances = [];
            this.gluePluginStore = gluePluginStore;
        }
        init() {
            // this.app.addEventListener('booting.web', (...args: any[]): void => {
            //   console.log({message: 'booting web event listener', args});
            //   console.log(this.gluePluginStore.get('message'));
            //   this.gluePluginStore.set('message', 'Hello from develop plugin');
            //   console.log(this.gluePluginStore.get('message'));
            // });
        }
        destroy() {
            //
        }
        getName() {
            return package_json_1.default.name;
        }
        getVersion() {
            return package_json_1.default.version;
        }
        getType() {
            return this.type;
        }
        // @ts-ignore
        getTemplateFolderPath() {
            return `${process.cwd()}/node_modules/${this.getName()}/template`;
        }
        getInstallationPath(target) {
            return `./${target}`;
        }
        runPostInstall(instanceName, target) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const plugin = this.app.getPluginByName("@gluestack-v2/glue-plugin-develop");
                // Validation
                if ((_a = plugin === null || plugin === void 0 ? void 0 : plugin.getInstances()) === null || _a === void 0 ? void 0 : _a[0]) {
                    throw new Error(`develop instance already installed as ${plugin.getInstances()[0].getName()}`);
                }
            });
        }
        createInstance(key, gluePluginStore, installationPath) {
            const instance = new PluginInstance_1.PluginInstance(this.app, this, key, gluePluginStore, installationPath);
            this.instances.push(instance);
            return instance;
        }
        getInstances() {
            return this.instances;
        }
    }
    exports.GlueStackPlugin = GlueStackPlugin;
});
