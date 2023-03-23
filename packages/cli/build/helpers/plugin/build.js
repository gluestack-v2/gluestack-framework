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
const { exec } = require('child_process');
const { fileExists, copyFile, createFolder } = require('../file');
const { error, info } = require('../print');
const tsStubFiles = [
    {
        source: 'node_modules/@gluestack-v2/framework-cli/build/types/plugin/stubs/tsconfig.json.txt',
        target: 'tsconfig.json',
    },
];
function copyTsFiles(currentDir) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const stubFile of tsStubFiles) {
            if (stubFile.dir) {
                if (!(yield fileExists(stubFile.dir))) {
                    yield createFolder(stubFile.dir);
                }
            }
            yield copyFile(`${currentDir}/${stubFile.source}`, `${currentDir}/${stubFile.target}`);
        }
    });
}
function runner() {
    return __awaiter(this, void 0, void 0, function* () {
        const steps = ['tsc'];
        for (const step of steps) {
            yield new Promise((resolve, reject) => {
                exec(step, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                    resolve(true);
                }));
            });
        }
    });
}
module.exports = (currentDir) => __awaiter(void 0, void 0, void 0, function* () {
    yield copyTsFiles(currentDir);
    yield runner();
});
