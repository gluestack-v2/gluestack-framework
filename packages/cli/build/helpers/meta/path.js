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
const path = require('path');
const { fileExists } = require('../file');
const { getVar } = require('../variables');
const { migrationDir } = require('../../constants/meta.json');
const { error } = require('../print');
const migrationPath = () => __awaiter(void 0, void 0, void 0, function* () {
    const projectPath = getVar('projectPath');
    const _path = path.join(projectPath, migrationDir);
    if (!fileExists(_path)) {
        error('Error', 'Hasura metadata directory not found or incorrect structure.');
        process.exit(1);
    }
    return _path;
});
module.exports = {
    migrationPath,
};
