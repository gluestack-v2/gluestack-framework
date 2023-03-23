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
const fs = require('fs');
const path = require('path');
const { copyFile } = require('./copy-file');
const { createFolder } = require('./create-folder');
const { fileExists } = require('./file-exists');
const copyFolder = (source, target, depth = 0) => __awaiter(void 0, void 0, void 0, function* () {
    if (!source.includes('.git')) {
        let files = [];
        // Check if folder needs to be created or integrated
        const targetFolder = path.join(target, path.basename(depth ? source : '.'));
        if (!(yield fileExists(targetFolder))) {
            yield createFolder(targetFolder);
        }
        // Copy
        if (fs.lstatSync(source).isDirectory() ||
            fs.lstatSync(source).isSymbolicLink()) {
            files = fs.readdirSync(source);
            files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
                let curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    yield copyFolder(curSource, targetFolder, depth++);
                }
                else {
                    yield copyFile(curSource, targetFolder, depth++);
                }
            }));
        }
    }
});
module.exports = { copyFolder };
