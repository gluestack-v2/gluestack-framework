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
        define(["require", "exports", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dockerStatus = void 0;
    const child_process_1 = require("child_process");
    const dockerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const _spawn = (0, child_process_1.spawn)('docker', [
                'info',
                '-f',
                `'{{ json .}}'`,
            ]);
            let data = '';
            _spawn.on('error', () => {
                return reject(`"DOCKER" is running?`);
            });
            _spawn.stdout.on('data', (response) => __awaiter(void 0, void 0, void 0, function* () { return (data += response); }));
            _spawn.on('exit', (result) => {
                if (result) {
                    return reject(`"DOCKER" is running?`);
                }
                data.includes('ServerErrors')
                    ? reject(`"DOCKER" is running?`)
                    : resolve(`"DOCKER" is running?`);
            });
        });
    });
    exports.dockerStatus = dockerStatus;
});
