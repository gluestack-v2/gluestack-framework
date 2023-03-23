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
const getPlugin = require('../helpers/getPlugin');
const { success, error } = require('../helpers/print');
function getAndValidatePackageJson(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fileExists(filepath)) {
            error('Plugin version command failed: package.json does not exists');
            process.exit(0);
        }
        const packageJson = require(filepath);
        if (!packageJson) {
            error('Plugin version command failed: package.json does not exists');
            process.exit(0);
        }
        return packageJson;
    });
}
module.exports = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDir = process.cwd();
    const filepath = currentDir + '/package.json';
    const packageJson = yield getAndValidatePackageJson(filepath);
    const plugin = yield getPlugin(app, currentDir, `${packageJson.name}`, true);
    success(`${packageJson.name} is at v${plugin.getVersion()}`);
});
