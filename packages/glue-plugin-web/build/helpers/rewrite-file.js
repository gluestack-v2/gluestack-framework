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
        define(["require", "exports", "fs", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reWriteFile = void 0;
    const fs_1 = __importDefault(require("fs"));
    const util_1 = __importDefault(require("util"));
    const readFile = util_1.default.promisify(fs_1.default.readFile);
    const writeFile = util_1.default.promisify(fs_1.default.writeFile);
    // Replaces file's content with the given database name
    const reWriteFile = (filePath, db_Name, defaultVar = 'my_first_db') => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let data = yield readFile(filePath, "utf8");
                // @ts-ignore
                data = data.replaceAll(defaultVar, db_Name);
                yield writeFile(filePath, data);
                resolve('done');
            }
            catch (err) {
                reject(err);
            }
        }));
    });
    exports.reWriteFile = reWriteFile;
});
