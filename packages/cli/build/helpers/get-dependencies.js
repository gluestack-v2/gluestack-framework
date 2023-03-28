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
const path = require('path');
const getPlugin = require('./getPlugin');
const { attachPluginInstances } = require('./meta/plugin-instances');
const getDependencies = (app, pluginName) => __awaiter(void 0, void 0, void 0, function* () {
    const dependencies = [];
    const packageJSON = path.join(pluginName, 'package.json');
    const peerDependencies = require(packageJSON).peerDependencies;
    for (const dependency of Object.keys(peerDependencies)) {
        try {
            const plugin = yield getPlugin(app, dependency, dependency, false);
            if (plugin) {
                yield attachPluginInstances(app, process.cwd(), [
                    { plugin: plugin },
                ]);
                dependencies.push(plugin);
            }
        }
        catch (err) {
            //
        }
    }
    return dependencies;
});
module.exports = getDependencies;
