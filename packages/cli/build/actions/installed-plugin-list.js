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
        define(["require", "exports", "cli-table3", "../helpers/print", "../helpers/meta/plugins", "../helpers/meta/plugin-instances"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const cli_table3_1 = __importDefault(require("cli-table3"));
    const print_1 = require("../helpers/print");
    const plugins_1 = require("../helpers/meta/plugins");
    const plugin_instances_1 = require("../helpers/meta/plugin-instances");
    const printConsoleTable = (head, rows) => __awaiter(void 0, void 0, void 0, function* () {
        const chars = {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        };
        let table = new cli_table3_1.default({
            head: head.map(value => value.green),
            chars
        });
        table.push(...rows);
        console.log(table.toString());
    });
    const printPlugins = (plugins) => {
        const arr = [];
        plugins.forEach((plugin) => {
            const pluginName = [plugin.key, plugin.plugin.getVersion()];
            if (!arr.includes(pluginName)) {
                arr.push(pluginName);
            }
        });
        if (arr.length > 0) {
            (0, print_1.info)('Installed Plugins');
            const head = ['Plugin', 'version'];
            printConsoleTable(head, arr);
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
        plugins.forEach(({ key, plugin }, index) => {
            if (plugin.getInstances) {
                plugin.getInstances().forEach((pluginInstance) => {
                    const installationPath = pluginInstance.getInstallationPath ? pluginInstance.getInstallationPath() : '';
                    const pluginInstanceArr = [index, key, pluginInstance.getName(), installationPath, plugin.getVersion()];
                    arr.push(pluginInstanceArr);
                });
            }
        });
        if (arr.length > 0) {
            (0, print_1.info)('Installed Instances');
            const head = ['(index)', 'plugin', 'instance', 'directory', 'version'];
            printConsoleTable(head, arr);
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
        if (!app.plugins.length) {
            (0, print_1.error)('Nothing installed in your app.', 'Please install one plugin and try again.');
            process.exit(-1);
        }
        yield printInstalledPlugins(app);
        yield printInstalledPluginInstances(app);
    });
});
