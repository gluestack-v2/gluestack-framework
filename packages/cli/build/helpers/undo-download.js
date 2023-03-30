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
const { resolve } = require('path');
const exec = require('child_process').exec;
function execute(steps) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const step of steps) {
            yield new Promise((resolve, reject) => {
                exec(step, (error, _stdout, _stderr) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(true);
                }));
            });
        }
    });
}
module.exports = (packageName) => __awaiter(void 0, void 0, void 0, function* () {
    if (packageName.startsWith('./') || packageName.startsWith('../')) {
        const localPackagePath = resolve(packageName);
        yield execute([`npm uninstall ${localPackagePath}`]);
    }
    else {
        yield execute([`npm uninstall ${packageName}`]);
    }
});
