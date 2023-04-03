var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        define(["require", "exports", "https", "../helpers/download", "../helpers/getPlugin", "../helpers/variables", "../helpers/meta/exists", "../helpers/isGluePackage", "../helpers/meta/plugins", "../helpers/get-dependencies", "../helpers/print", "../helpers/remove-special-chars", "../helpers/file", "../helpers/meta/plugin-instances", "../helpers/undo-download"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const https_1 = __importDefault(require("https"));
    const download_1 = __importDefault(require("../helpers/download"));
    const getPlugin_1 = __importDefault(require("../helpers/getPlugin"));
    const variables_1 = __importDefault(require("../helpers/variables"));
    const exists_1 = __importDefault(require("../helpers/meta/exists"));
    const isGluePackage_1 = __importDefault(require("../helpers/isGluePackage"));
    const plugins_1 = require("../helpers/meta/plugins");
    const get_dependencies_1 = __importDefault(require("../helpers/get-dependencies"));
    const print_1 = require("../helpers/print");
    const remove_special_chars_1 = __importDefault(require("../helpers/remove-special-chars"));
    const file_1 = require("../helpers/file");
    const plugin_instances_1 = require("../helpers/meta/plugin-instances");
    const undo_download_1 = __importDefault(require("../helpers/undo-download"));
    const { setVar } = variables_1.default;
    const prefix = 'glue-plugin-';
    const metaPluginInstance = plugin_instances_1.pluginInstance;
    const validateAndGet = (pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
        let packageName = pluginName;
        try {
            yield checkForPackage(pluginName);
            packageName = `@gluestack-v2/${prefix}${pluginName}`;
        }
        catch (e) {
            //
        }
        if (!(0, isGluePackage_1.default)(packageName)) {
            (0, print_1.error)(`"${packageName}" is not supported`);
            process.exit(0);
        }
        instanceName = (0, remove_special_chars_1.default)(instanceName);
        if (instanceName.indexOf('/') !== -1) {
            (0, print_1.error)(`${instanceName} is not valid, does not support nested instance.`);
            process.exit(0);
        }
        // adding the installed plugins
        const pluginInstancesFilePath = process.cwd() + '/.glue/internals/plugin-instances.json';
        const pluginFilePath = process.cwd() + '/.glue/internals/plugins.json';
        if (!(0, file_1.fileExists)(pluginFilePath)) {
            (0, print_1.error)("Meta file is missing. Please go to project's root directory.");
            process.exit(0);
        }
        // check if plugin exists
        yield (0, exists_1.default)(pluginInstancesFilePath, instanceName);
        return {
            pluginInstancesFilePath,
            pluginFilePath,
            folderName: instanceName,
            packageName,
        };
    });
    const checkForPackage = (pluginName) => {
        return new Promise((resolve, reject) => {
            https_1.default
                .get(`https://registry.npmjs.org/@gluestack-v2/${prefix}${pluginName}`, (res) => {
                if (res.statusCode === 200) {
                    let body = '';
                    res.on('data', (data) => (body += data));
                    res.on('end', () => {
                        resolve(JSON.parse(body).latest);
                    });
                }
                else {
                    reject();
                }
            })
                .on('error', (e) => {
                reject(e);
            });
        });
    };
    const checkForDependencies = (app, packageName) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        let missing = [];
        const dependencies = yield (0, get_dependencies_1.default)(app, packageName);
        for (const plugin of dependencies) {
            if (plugin.getInstances().length === 0) {
                missing.push(plugin);
            }
        }
        if (missing.length) {
            (0, print_1.error)(`${packageName} installed failed: Missing dependencies`);
            console.log('\x1b[36m');
            try {
                for (var _d = true, missing_1 = __asyncValues(missing), missing_1_1; missing_1_1 = yield missing_1.next(), _a = missing_1_1.done, !_a;) {
                    _c = missing_1_1.value;
                    _d = false;
                    try {
                        const plugin = _c;
                        let arr = plugin.getName().split('-');
                        console.log(`Install dependency: \`node glue add ${plugin.getName()} ${arr[arr.length - 1]}\``);
                        yield (0, undo_download_1.default)(packageName);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = missing_1.return)) yield _b.call(missing_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield (0, undo_download_1.default)(packageName);
            console.log('\x1b[37m');
            process.exit(0);
        }
    });
    exports.default = (app, pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
        setVar('pluginName', pluginName);
        const { pluginInstancesFilePath, pluginFilePath, folderName, packageName, } = yield validateAndGet(pluginName, instanceName);
        // download plugin project
        yield (0, download_1.default)(pluginName, packageName);
        const plugin = yield (0, getPlugin_1.default)(app, packageName, packageName, true);
        const folderPath = yield plugin.getInstallationPath(folderName);
        if (folderPath !== process.cwd() &&
            !(yield (0, file_1.checkFolderIsEmpty)(folderPath))) {
            (0, print_1.error)(`${pluginName} installed failed: ${folderPath} is not empty`);
            process.exit(0);
        }
        yield checkForDependencies(app, packageName);
        try {
            yield plugin.runPostInstall(folderName, folderPath);
        }
        catch (e) {
            (0, print_1.error)(`${pluginName} installed failed: ${e.message || 'Something went wrong'}`);
            (0, print_1.newline)();
            process.exit(0);
        }
        // updates meta/plugin-instances.json file
        yield metaPluginInstance(pluginInstancesFilePath, packageName, folderName, folderPath);
        yield (0, plugins_1.writePlugin)(pluginFilePath, packageName, plugin);
        (0, print_1.success)(`Sucessfully installed '${pluginName}' as instance ${folderName} in directory '${folderPath}'`);
        (0, print_1.newline)();
    });
});
