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
        define(["require", "exports", "../package.json", "./PluginInstance", "./helpers/rewrite-file", "@gluestack/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GlueStackPlugin = void 0;
    // @ts-ignore
    const package_json_1 = __importDefault(require("../package.json"));
    const PluginInstance_1 = require("./PluginInstance");
    const rewrite_file_1 = require("./helpers/rewrite-file");
    const helpers_1 = require("@gluestack/helpers");
    // Do not edit the name of this class
    class GlueStackPlugin {
        constructor(app, gluePluginStore) {
            this.type = 'stateless';
            this.app = app;
            this.instances = [];
            this.gluePluginStore = gluePluginStore;
        }
        init() {
            this.app.dispatchEvent('booting.web', this.getName());
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
            return __awaiter(this, void 0, void 0, function* () {
                const instance = yield this.app.createPluginInstance(this, instanceName, this.getTemplateFolderPath(), target);
                if (!instance) {
                    return;
                }
                // rewrite router.js with the installed instance name
                const routerFile = `${instance.getInstallationPath()}/router.js`;
                yield (0, rewrite_file_1.reWriteFile)(routerFile, (0, helpers_1.removeSpecialChars)(instanceName), 'INSTANCENAME');
                // update package.json'S name index with the new instance name
                const pluginPackage = `${instance.getInstallationPath()}/package.json`;
                yield (0, rewrite_file_1.reWriteFile)(pluginPackage, instanceName, 'INSTANCENAME');
                // update root package.json's workspaces with the new instance name
                const rootPackage = `${process.cwd()}/package.json`;
                yield helpers_1.Workspaces.append(rootPackage, instance.getInstallationPath());
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
