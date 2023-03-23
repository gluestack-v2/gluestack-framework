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
const { error } = require('../print');
const { spawn } = require('child_process');
const docker = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const _spawn = spawn('docker', ['--version'], process.platform === 'win32'
            ? { shell: true }
            : { shell: false });
        let dockerVersion = '';
        _spawn.on('error', () => {
            return reject(`"DOCKER" is installed?`);
        });
        _spawn.stdout.on('data', (data) => {
            dockerVersion += data.toString();
        });
        _spawn.on('exit', (result) => {
            if (result) {
                return reject(`"DOCKER" is installed?`);
            }
            const versionMatch = dockerVersion.match(/(\d+)\.\d+/);
            const data = versionMatch === null || versionMatch === void 0 ? void 0 : versionMatch[0];
            const version = data.toString().split('.');
            version.splice(2);
            if (+version[0] < 20) {
                error(`"Docker" version must be greater than or equal 20`);
                return reject();
            }
            if (+version[0] <= 20 && +version[1] < 10) {
                error(`"Docker" version must be greater than or equal 20`);
                return reject();
            }
            return resolve(`"DOCKER" is installed?`);
        });
    });
});
module.exports = { docker };
