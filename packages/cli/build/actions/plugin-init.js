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
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const { fileExists, readFile, writeFile, copyFile, createFolder, } = require('../helpers/file');
const build = require('../helpers/plugin/build');
const runDoctorPlugin = require('./doctorPlugin');
const { error, warning, success, info } = require('../helpers/print');
const mainEntryPoint = 'dist/src/index.js';
const pluginStubFiles = {
    instance: [
        {
            dir: 'src',
            source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/GlueStackPlugin.ts.txt',
            target: 'src/index.ts',
        },
        {
            dir: 'src',
            source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstance.ts.txt',
            target: 'src/PluginInstance.ts',
        },
    ],
    container: [
        {
            dir: 'src',
            source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/GlueStackPlugin.ts.txt',
            target: 'src/index.ts',
        },
        {
            dir: 'src',
            source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstanceWithContainerController.ts.txt',
            target: 'src/PluginInstance.ts',
        },
        {
            dir: 'src',
            source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/PluginInstanceContainerController.ts.txt',
            target: 'src/PluginInstanceContainerController.ts',
        },
    ],
};
function getAndValidatePackageJson(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fileExists(filepath)) {
            error('Plugin init command failed: package.json does not exists');
            process.exit(0);
        }
        const packageJson = require(filepath);
        if (!packageJson) {
            error('Plugin init command failed: package.json does not exists');
            process.exit(0);
        }
        return packageJson;
    });
}
function writeToPackageJson(filepath, packageJson) {
    return __awaiter(this, void 0, void 0, function* () {
        if (packageJson.main) {
            if (packageJson.main === mainEntryPoint) {
                warning('Plugin init command failed: already a plugin');
                process.exit(0);
            }
            error('Writing to package.json failed: plugin entry point already exists');
            process.exit(0);
        }
        const json = yield readFile(filepath);
        json.main = mainEntryPoint;
        json.scripts = Object.assign(Object.assign({}, json.scripts), { 'plugin-dev': 'tsc --watch', 'plugin-build': 'tsc --declaration' });
        yield writeFile(filepath, JSON.stringify(json, null, 2) + os.EOL);
        return json.name;
    });
}
function copyPluginFiles(currentDir, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (pluginStubFiles[type]) {
            for (const stubFile of pluginStubFiles[type]) {
                if (stubFile.dir) {
                    if (!(yield fileExists(stubFile.dir))) {
                        yield createFolder(stubFile.dir);
                    }
                }
                yield copyFile(`${currentDir}/${stubFile.source}`, `${currentDir}/${stubFile.target}`);
            }
        }
    });
}
function createTemplateFolder(currentDir, packageJson) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createFolder(`${currentDir}/template`);
        yield writeFile(`${currentDir}/template/README.md`, packageJson.name);
    });
}
module.exports = (app, pluginName, type) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDoctorPlugin();
    const currentDir = path.join(process.cwd(), 'packages', pluginName);
    // creating plugin directory
    yield createFolder(currentDir);
    yield writeFile(path.join(currentDir, 'package.json', '{}'));
    const filepath = currentDir + '/package.json';
    const packageJson = yield getAndValidatePackageJson(filepath);
    yield writeToPackageJson(filepath, packageJson);
    yield build(currentDir);
    yield copyPluginFiles(currentDir, type);
    yield createTemplateFolder(currentDir, packageJson);
    yield new Promise((resolve, reject) => {
        exec('npm install @types/node', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                reject(error);
                return;
            }
            info(stdout);
            exec('npm install typescript --save-dev', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                    return;
                }
                info(stdout);
                exec('npm install --save-peer @gluestack-v2/framework-cli', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        reject(error);
                        return;
                    }
                    info(stdout);
                    resolve(true);
                }));
            }));
        }));
    });
    success(`Successfully initialized ${packageJson.name} as a plugin \n`);
});
