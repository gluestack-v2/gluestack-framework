"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { isEmpty } = require('lodash');
const { readFile, writeFile } = require('../file');
const getPlugin = require('../getPlugin');
const isGluePackage = require('../isGluePackage');
const { error } = require('../print');
const writePlugin = (pluginFilePath, packageName, pluginName, plugin) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield readFile(pluginFilePath);
    if (!data) {
        error('.glue/internals plugins file is corrupted.');
        process.exit(0);
    }
    if (!data[pluginName]) {
        data[pluginName] = {
            package: packageName,
        };
        // write plugins in file
        yield writeFile(pluginFilePath, JSON.stringify(data, null, 2));
    }
});
const getPluginTree = (app, path, depth = 0, tree = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let key = depth ? 'peerDependencies' : 'dependencies';
    const pluginFilePath = `${path}/package.json`;
    const data = yield require(pluginFilePath);
    if (!data[key] || isEmpty(data[key])) {
        return null;
    }
    const plugins = Object.keys(data[key]).filter((_package) => {
        if (isGluePackage(_package))
            return _package;
    });
    if (!plugins || !plugins.length) {
        return null;
    }
    for (const plugin of plugins) {
        tree[plugin] = {
            plugin: yield getPlugin(app, plugin, plugin),
            dependencies: yield getPluginTree(app, plugin, ++depth),
        };
    }
    return tree;
});
function getTopToBottomPluginTree(app, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const tree = yield getPluginTree(app, path);
        function recursivelyJoinArray(tree, arr = []) {
            if (tree && !isEmpty(tree)) {
                Object.keys(tree).forEach((key) => {
                    if (tree[key].plugin) {
                        arr.push({
                            key: key,
                            plugin: tree[key].plugin,
                        });
                    }
                });
                Object.keys(tree).forEach((key) => {
                    if (tree[key].dependencies) {
                        recursivelyJoinArray(tree[key].dependencies, arr);
                    }
                });
            }
            return arr;
        }
        return recursivelyJoinArray(tree, []);
    });
}
function getBottomToTopPluginTree(app, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const array = yield getTopToBottomPluginTree(app, path);
        return array.reverse();
    });
}
module.exports = {
    writePlugin,
    getPluginTree,
    getTopToBottomPluginTree,
    getBottomToTopPluginTree,
};
