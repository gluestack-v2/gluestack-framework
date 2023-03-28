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
const { join } = require('path');
const { createFolder, fileExists, copyFolder } = require('./file');
const writer = {};
// Moves folders/files into the .glue/seal/services directory and
// creates the .glue/seal/services directory if it doesn't exist
writer.write = (path, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
    const sealPath = join(process.cwd(), '.glue/seal/services');
    if (!fileExists(sealPath)) {
        yield createFolder(sealPath);
    }
    const instancePath = join(sealPath, instanceName, 'src', instanceName);
    if (!fileExists(instancePath)) {
        yield createFolder(instancePath);
    }
    yield copyFolder(path, instancePath);
});
module.exports = writer;
