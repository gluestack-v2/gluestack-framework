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
const { fileExists } = require('./file-exists');
const copyFile = (source, target) => __awaiter(void 0, void 0, void 0, function* () {
    let targetFile = target;
    // If target is a directory, a new file with the same name will be created
    if (fileExists(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    yield fs.writeFileSync(targetFile, fs.readFileSync(source));
});
module.exports = { copyFile };
