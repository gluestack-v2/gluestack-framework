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
const https = require('https');
const { setVar } = require('../helpers/variables');
const { fileExists, checkFolderIsEmpty } = require('../helpers/file');
const download = require('../helpers/download');
const { pluginInstance: metaPluginInstance, } = require('../helpers/meta/plugin-instances');
const metaExists = require('../helpers/meta/exists');
const { success, error, newline } = require('../helpers/print');
const { writePlugin } = require('../helpers/meta/plugins');
const getPlugin = require('../helpers/getPlugin');
const isGluePackage = require('../helpers/isGluePackage');
const getDependencies = require('../helpers/get-dependencies');
const removeSpecialChars = require('../helpers/remove-special-chars');
const prefix = 'glue-plugin-';
function validateAndGet(pluginName, instanceName) {
    return __awaiter(this, void 0, void 0, function* () {
        let packageName = pluginName;
        try {
            yield checkForPackage(pluginName);
            packageName = `@gluestack-v2/${prefix}${pluginName}`;
        }
        catch (e) {
            //
        }
        if (!isGluePackage(packageName)) {
            error(`"${packageName}" is not supported`);
            process.exit(0);
        }
        instanceName = removeSpecialChars(instanceName);
        if (instanceName.indexOf('/') !== -1) {
            error(`${instanceName} is not valid, does not support nested instance.`);
            process.exit(0);
        }
        // adding the installed plugins
        const pluginInstancesFilePath = process.cwd() + '/.glue/internals/plugin-instances.json';
        const pluginFilePath = process.cwd() + '/.glue/internals/plugins.json';
        if (!fileExists(pluginFilePath)) {
            error("Meta file is missing. Please go to project's root directory.");
            process.exit(0);
        }
        const folderName = instanceName;
        // check if plugin exists
        yield metaExists(pluginInstancesFilePath, packageName, folderName);
        return {
            pluginInstancesFilePath,
            pluginFilePath,
            folderName,
            packageName,
        };
    });
}
function checkForPackage(pluginName) {
    return new Promise((resolve, reject) => {
        https
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
}
module.exports = (app, pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
    setVar('pluginName', pluginName);
    const { pluginInstancesFilePath, pluginFilePath, folderName, packageName, } = yield validateAndGet(pluginName, instanceName);
    // download plugin project
    yield download(pluginName, packageName);
    const plugin = yield getPlugin(app, packageName, packageName, true);
    const folderPath = yield plugin.getInstallationPath(folderName);
    if (folderPath !== process.cwd() && !(yield checkFolderIsEmpty(folderPath))) {
        error(`${pluginName} installed failed: ${folderPath} is not empty`);
        process.exit(0);
    }
    yield checkForDependencies(app, packageName);
    try {
        yield plugin.runPostInstall(folderName, folderPath);
    }
    catch (e) {
        error(`${pluginName} installed failed: ${e.message || 'Something went wrong'}`);
        newline();
        process.exit(0);
    }
    // updates meta/plugin-instances.json file
    yield metaPluginInstance(pluginInstancesFilePath, packageName, folderName, folderPath);
    yield writePlugin(pluginFilePath, packageName, plugin);
    success(`Sucessfully installed '${pluginName}' as instance ${folderName} in directory '${folderPath}'`);
    newline();
});
function checkForDependencies(app, packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        let missing = [];
        const dependencies = yield getDependencies(app, packageName);
        for (const plugin of dependencies) {
            if (plugin.getInstances().length === 0) {
                missing.push(plugin);
            }
        }
        if (missing.length) {
            error(`${packageName} installed failed: Missing dependencies`);
            console.log('\x1b[36m');
            for (const plugin of missing) {
                let arr = plugin.getName().split('-');
                console.log(`Install dependency: \`node glue add ${plugin.getName()} ${arr[arr.length - 1]}\``);
            }
            console.log('\x1b[37m');
            newline();
            process.exit(0);
        }
    });
}
