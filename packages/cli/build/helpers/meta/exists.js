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
const { map } = require('lodash');
const { error } = require('../print');
const { readFile } = require('../file');
module.exports = (pluginPath, pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield readFile(pluginPath);
    if (!data) {
        error('~/.glue/internals files are corrupted. Missing configuration.');
        process.exit(0);
    }
    for (const pluginName of Object.keys(data)) {
        map(data[pluginName], (pluginInstance) => {
            if (pluginInstance.instance === instanceName) {
                error(`"${instanceName}" instance already added from plugin "${pluginName}"`);
                process.exit(0);
            }
        });
    }
});
