"use strict";
/**
 * Installs the project or plugin
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Argument } = require('commander');
const install = require('../actions/install');
module.exports = (program, app) => __awaiter(void 0, void 0, void 0, function* () {
    // install group command
    const command = program
        .command('add')
        .alias('install')
        .description('installs a gluestack plugin, use help for more info on subcommands')
        .addArgument(new Argument('<plugin-name>', 'name of the plugin from gluestack group'))
        .addArgument(new Argument('<instance-name>', 'name of the instance to install the plugin'))
        .action((pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
        yield install(app, pluginName, instanceName);
    }));
});
