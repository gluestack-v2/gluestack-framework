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
        define(["require", "exports", "../helpers/print", "../helpers/meta/plugins", "../helpers/meta/plugin-instances"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const print_1 = require("../helpers/print");
    const plugins_1 = require("../helpers/meta/plugins");
    const plugin_instances_1 = require("../helpers/meta/plugin-instances");
    const printPlugins = (plugins) => {
        const arr = {};
        plugins.forEach((plugin) => {
            if (!arr[plugin.key]) {
                arr[plugin.key] = {
                    version: plugin.plugin.getVersion(),
                };
            }
        });
        if (Object.keys(arr).length) {
            (0, print_1.info)('Installed Plugins');
            console.table(arr);
            return;
        }
        (0, print_1.warning)('No plugins are installed in your app.');
    };
    const printInstalledPlugins = (app) => __awaiter(void 0, void 0, void 0, function* () {
        const plugins = yield (0, plugins_1.getTopToBottomPluginTree)(app, process.cwd());
        printPlugins(plugins);
        (0, print_1.newline)();
    });
    const printPluginInstances = (plugins) => {
        const arr = [];
        plugins.forEach(({ key, plugin }) => {
            if (plugin.getInstances) {
                plugin.getInstances().forEach((pluginInstance) => {
                    arr.push({
                        plugin: key,
                        instance: pluginInstance.getName(),
                        directory: pluginInstance.getInstallationPath
                            ? pluginInstance.getInstallationPath()
                            : '',
                        version: plugin.getVersion(),
                    });
                });
            }
        });
        if (Object.keys(arr).length) {
            (0, print_1.info)('Installed Instances');
            console.table(arr);
            return;
        }
        (0, print_1.warning)('No instances are installed in your app.');
    };
    const printInstalledPluginInstances = (app) => __awaiter(void 0, void 0, void 0, function* () {
        const plugins = yield (0, plugin_instances_1.getTopToBottomPluginInstanceTree)(app, process.cwd());
        printPluginInstances(plugins);
        (0, print_1.newline)();
    });
    exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
        yield printInstalledPlugins(app);
        yield printInstalledPluginInstances(app);
    });
});
