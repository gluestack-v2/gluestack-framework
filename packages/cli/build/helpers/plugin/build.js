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
        define(["require", "exports", "child_process", "../file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const child_process_1 = require("child_process");
    const file_1 = require("../file");
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
                    if (!(yield (0, file_1.fileExists)(stubFile.dir))) {
                        yield (0, file_1.createFolder)(stubFile.dir);
                    }
                }
                yield (0, file_1.copyFile)(`${currentDir}/${stubFile.source}`, `${currentDir}/${stubFile.target}`);
            }
        });
    }
    function runner() {
        return __awaiter(this, void 0, void 0, function* () {
            const steps = ['tsc'];
            for (const step of steps) {
                yield new Promise((resolve, reject) => {
                    (0, child_process_1.exec)(step, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                        resolve(true);
                    }));
                });
            }
        });
    }
    exports.default = (currentDir) => __awaiter(void 0, void 0, void 0, function* () {
        yield copyTsFiles(currentDir);
        yield runner();
    });
});
