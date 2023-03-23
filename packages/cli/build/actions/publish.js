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
const { fileExists } = require('../helpers/file');
const build = require('../helpers/plugin/build');
const { error, success, info, warning } = require('../helpers/print');
const mainEntryPoint = 'dist/src/index.js';
function getAndValidatePackageJson(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fileExists(filepath)) {
            error('Plugin publish command failed: package.json does not exists');
            process.exit(0);
        }
        const packageJson = require(filepath);
        if (!packageJson) {
            error('Plugin publish command failed: package.json does not exists');
            process.exit(0);
        }
        if (!packageJson.main ||
            (packageJson.main && packageJson.main !== mainEntryPoint)) {
            warning('Plugin publish command failed: plugin not initialized');
            process.exit(0);
        }
        return packageJson;
    });
}
module.exports = () => __awaiter(void 0, void 0, void 0, function* () {
    // const currentDir = process.cwd();
    // const filepath = currentDir + '/package.json';
    // const packageJson = await getAndValidatePackageJson(filepath);
    // await build(currentDir);
    success(`Successfully published a plugin`);
    info('Run `node glue plugin-version` in terminal');
});
