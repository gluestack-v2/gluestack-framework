var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../print", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.npm = void 0;
    const print_1 = require("../print");
    const child_process_1 = require("child_process");
    const npm = () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const _spawn = (0, child_process_1.spawn)('npm', ['-v'], process.platform === 'win32'
                ? { shell: true }
                : { shell: false });
            _spawn.on('error', () => {
                return reject(`"NPM" is installed?`);
            });
            if (_spawn === null || _spawn === void 0 ? void 0 : _spawn.stdout)
                _spawn.stdout.on('data', (data) => {
                    data = data
                        .toString()
                        .replace(/[^\d.]/g, '')
                        .replace(/\.\d+/g, '');
                    if (Number(data) < 8) {
                        (0, print_1.error)(`"NPM" version must be greater than or equal 8`);
                        return reject();
                    }
                });
            _spawn.on('exit', (result) => {
                if (result) {
                    return reject(`"NPM" is installed?`);
                }
                return resolve(`"NPM" is installed?`);
            });
        });
    });
    exports.npm = npm;
});
