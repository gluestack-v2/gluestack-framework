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
const { error } = require('../print');
const { readFile, writeFile } = require('../file');
const { getTopToBottomPluginTree } = require('./plugins');
const { injectPluginInstanceStore } = require('../getStorePath');
const pluginInstance = (pluginInstancesFilePath, packageName, instanceName, directoryName) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield readFile(pluginInstancesFilePath);
    if (!data) {
        error('~/.glue/internals plugin instances file is corrupted.');
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
    yield writeFile(pluginInstancesFilePath, JSON.stringify(data, null, 2));
});
function attachPluginInstances(app, path, plugins) {
    return __awaiter(this, void 0, void 0, function* () {
        const pluginInstancesFilePath = `${path}/.glue/internals/plugin-instances.json`;
        const pluginInstances = yield readFile(pluginInstancesFilePath);
        if (!pluginInstances || isEmpty(pluginInstances)) {
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
function getTopToBottomPluginInstanceTree(app, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = yield getTopToBottomPluginTree(app, path);
        yield attachPluginInstances(app, path, plugins);
        return plugins;
    });
}
function getBottomToTopPluginInstanceTree(app, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const array = yield getTopToBottomPluginInstanceTree(app, path);
        return array.reverse();
    });
}
function attachPluginInstance(app, plugin, instance, directory) {
    return plugin.createInstance(instance, injectPluginInstanceStore(app, plugin.getName(), instance), directory);
}
module.exports = {
    pluginInstance,
    attachPluginInstances,
    getTopToBottomPluginInstanceTree,
    getBottomToTopPluginInstanceTree,
    attachPluginInstance,
};
