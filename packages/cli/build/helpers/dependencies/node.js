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
const node = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const _spawn = spawn('node', ['-v'], process.platform === 'win32'
            ? { shell: true }
            : { shell: false });
        _spawn.on('error', () => {
            return reject(`"NODE" is installed?`);
        });
        _spawn.stdout.on('data', (data) => {
            data = data
                .toString()
                .replace(/[^\d.]/g, '')
                .replace(/\.\d+/g, '');
            if (data < 18) {
                error(`"NODE" version must be greater than or equal 18`);
                return reject();
            }
        });
        _spawn.on('exit', (result) => {
            if (result) {
                return reject(`"NODE" is installed?`);
            }
            return resolve(`"NODE" is installed?`);
        });
    });
});
module.exports = { node };
