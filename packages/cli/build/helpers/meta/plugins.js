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
        define(["require", "exports", "lodash", "../print", "../getPlugin", "../isGluePackage", "../file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBottomToTopPluginTree = exports.getTopToBottomPluginTree = exports.getPluginTree = exports.writePlugin = void 0;
    const lodash_1 = require("lodash");
    const print_1 = require("../print");
    const getPlugin_1 = __importDefault(require("../getPlugin"));
    const isGluePackage_1 = __importDefault(require("../isGluePackage"));
    const file_1 = require("../file");
    const writePlugin = (pluginFilePath, pluginName, plugin) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield (0, file_1.readFile)(pluginFilePath);
        if (!data) {
            (0, print_1.error)('.glue/internals plugins file is corrupted.');
            process.exit(0);
        }
        if (!data[pluginName]) {
            data[pluginName] = {
                package: pluginName,
            };
            // write plugins in file
            yield (0, file_1.writeFile)(pluginFilePath, JSON.stringify(data, null, 2));
        }
    });
    exports.writePlugin = writePlugin;
    const getPluginTree = (app, path, depth = 0, tree = {}) => __awaiter(void 0, void 0, void 0, function* () {
        let key = depth ? 'peerDependencies' : 'dependencies';
        const pluginFilePath = `${path}/package.json`;
        const data = yield require(pluginFilePath);
        if (!data[key] || (0, lodash_1.isEmpty)(data[key])) {
            return null;
        }
        const plugins = Object.keys(data[key]).filter((_package) => {
            if ((0, isGluePackage_1.default)(_package))
                return _package;
        });
        if (!plugins || !plugins.length) {
            return null;
        }
        for (const plugin of plugins) {
            tree[plugin] = {
                plugin: yield (0, getPlugin_1.default)(app, plugin, plugin),
                dependencies: yield (0, exports.getPluginTree)(app, plugin, ++depth),
            };
        }
        return tree;
    });
    exports.getPluginTree = getPluginTree;
    const getTopToBottomPluginTree = (app, path) => __awaiter(void 0, void 0, void 0, function* () {
        const tree = yield (0, exports.getPluginTree)(app, path);
        function recursivelyJoinArray(tree, arr) {
            if (tree && !(0, lodash_1.isEmpty)(tree)) {
                Object.keys(tree).forEach((key) => {
                    if (tree[key].dependencies) {
                        recursivelyJoinArray(tree[key].dependencies, arr);
                    }
                });
                Object.keys(tree).forEach((key) => {
                    if (tree[key].plugin) {
                        const exists = arr.some((obj) => obj.key === key);
                        if (!exists) {
                            arr.push({
                                key: key,
                                plugin: tree[key].plugin,
                            });
                        }
                    }
                });
            }
            return arr;
        }
        const arr = [];
        return recursivelyJoinArray(tree, arr);
    });
    exports.getTopToBottomPluginTree = getTopToBottomPluginTree;
    const getBottomToTopPluginTree = (app, path) => __awaiter(void 0, void 0, void 0, function* () {
        const array = yield (0, exports.getTopToBottomPluginTree)(app, path);
        return array.reverse();
    });
    exports.getBottomToTopPluginTree = getBottomToTopPluginTree;
});
