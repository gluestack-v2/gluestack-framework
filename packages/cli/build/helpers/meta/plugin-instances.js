var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash", "../print", "../file", "./plugins", "../getStorePath"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.attachPluginInstance = exports.getBottomToTopPluginInstanceTree = exports.getTopToBottomPluginInstanceTree = exports.attachPluginInstances = exports.pluginInstance = void 0;
    const lodash_1 = require("lodash");
    const print_1 = require("../print");
    const file_1 = require("../file");
    const plugins_1 = require("./plugins");
    const getStorePath_1 = require("../getStorePath");
    const pluginInstance = (pluginInstancesFilePath, packageName, instanceName, directoryName) => __awaiter(void 0, void 0, void 0, function* () {
        let data = (yield (0, file_1.readFile)(pluginInstancesFilePath));
        if (!data) {
            (0, print_1.error)('~/.glue/internals plugin instances file is corrupted.');
            process.exit(0);
        }
        if (!data[packageName]) {
            data[packageName] = [];
        }
        data[packageName].push({
            instance: instanceName,
            directory: directoryName,
            container_store: {},
        });
        // write pluginInstances in file
        yield (0, file_1.writeFile)(pluginInstancesFilePath, JSON.stringify(data, null, 2));
    });
    exports.pluginInstance = pluginInstance;
    function attachPluginInstances(app, path, plugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const pluginInstancesFilePath = `${path}/.glue/internals/plugin-instances.json`;
            const pluginInstances = (yield (0, file_1.readFile)(pluginInstancesFilePath));
            if (!pluginInstances || (0, lodash_1.isEmpty)(pluginInstances)) {
                return;
            }
            for (const { plugin } of plugins) {
                const instances = pluginInstances[plugin.getName()];
                if (instances) {
                    for (const { instance, directory } of instances) {
                        attachPluginInstance(app, plugin, instance, directory);
                    }
                }
            }
        });
    }
    exports.attachPluginInstances = attachPluginInstances;
    function getTopToBottomPluginInstanceTree(app, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const plugins = yield (0, plugins_1.getTopToBottomPluginTree)(app, path);
            yield attachPluginInstances(app, path, plugins);
            return plugins;
        });
    }
    exports.getTopToBottomPluginInstanceTree = getTopToBottomPluginInstanceTree;
    function getBottomToTopPluginInstanceTree(app, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = yield getTopToBottomPluginInstanceTree(app, path);
            return array.reverse();
        });
    }
    exports.getBottomToTopPluginInstanceTree = getBottomToTopPluginInstanceTree;
    function attachPluginInstance(app, plugin, instance, directory) {
        return plugin.createInstance(instance, (0, getStorePath_1.injectPluginInstanceStore)(app, plugin.getName(), instance), directory);
    }
    exports.attachPluginInstance = attachPluginInstance;
});
