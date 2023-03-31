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
        define(["require", "exports", "os", "child_process", "../helpers/file", "../helpers/plugin/build", "../helpers/print"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const os_1 = __importDefault(require("os"));
    const child_process_1 = require("child_process");
    const file_1 = require("../helpers/file");
    const build_1 = __importDefault(require("../helpers/plugin/build"));
    const print_1 = require("../helpers/print");
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
    const getAndValidatePackageJson = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(0, file_1.fileExists)(filepath)) {
            (0, print_1.error)('Plugin init command failed: package.json does not exists');
            process.exit(0);
        }
        const packageJson = require(filepath);
        if (!packageJson) {
            (0, print_1.error)('Plugin init command failed: package.json does not exists');
            process.exit(0);
        }
        return packageJson;
    });
    const writeToPackageJson = (filepath, packageJson) => __awaiter(void 0, void 0, void 0, function* () {
        if (packageJson.main) {
            if (packageJson.main === mainEntryPoint) {
                (0, print_1.warning)('Plugin init command failed: already a plugin');
                process.exit(0);
            }
            (0, print_1.error)('Writing to package.json failed: plugin entry point already exists');
            process.exit(0);
        }
        const json = yield (0, file_1.readFile)(filepath);
        json.main = mainEntryPoint;
        json.scripts = Object.assign(Object.assign({}, json.scripts), { 'plugin-dev': 'tsc --watch', 'plugin-build': 'tsc --declaration' });
        yield (0, file_1.writeFile)(filepath, JSON.stringify(json, null, 2) + os_1.default.EOL);
        return json.name;
    });
    function copyPluginFiles(currentDir, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pluginStubFiles[type]) {
                for (const stubFile of pluginStubFiles[type]) {
                    if (stubFile.dir) {
                        if (!(yield (0, file_1.fileExists)(stubFile.dir))) {
                            yield (0, file_1.createFolder)(stubFile.dir);
                        }
                    }
                    yield (0, file_1.copyFile)(`${currentDir}/${stubFile.source}`, `${currentDir}/${stubFile.target}`);
                }
            }
        });
    }
    function createTemplateFolder(currentDir, packageJson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, file_1.createFolder)(`${currentDir}/template`);
            yield (0, file_1.writeFile)(`${currentDir}/template/README.md`, packageJson.name);
        });
    }
    exports.default = (app, type) => __awaiter(void 0, void 0, void 0, function* () {
        const currentDir = process.cwd();
        const filepath = currentDir + '/package.json';
        const packageJson = yield getAndValidatePackageJson(filepath);
        yield writeToPackageJson(filepath, packageJson);
        yield (0, build_1.default)(currentDir);
        yield copyPluginFiles(currentDir, type);
        yield createTemplateFolder(currentDir, packageJson);
        yield new Promise((resolve, reject) => {
            (0, child_process_1.exec)('npm install @types/node', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                    return;
                }
                (0, print_1.info)(stdout);
                (0, child_process_1.exec)('npm install typescript --save-dev', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        reject(error);
                        return;
                    }
                    (0, print_1.info)(stdout);
                    (0, child_process_1.exec)('npm install --save-peer @gluestack-v2/framework-cli', (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                        if (error) {
                            reject(error);
                            return;
                        }
                        (0, print_1.info)(stdout);
                        resolve(true);
                    }));
                }));
            }));
        });
        (0, print_1.success)(`Successfully initialized ${packageJson.name} as a plugin \n`);
    });
});
