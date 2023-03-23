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
const { Command } = require('commander');
const { version } = require('../../package.json');
const commands = require('../commands');
const program = new Command();
const commander = {};
// initialize the glue command
commander.init = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.argv.length === 2) {
        process.argv.push('-h');
    }
    program
        .name('glue')
        .version('Gluestack Version ' + version)
        .description('Gluestack V2 Framework CLI');
});
// adds all the commands from the directory
commander.addCommands = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const cmds = commands().concat(app.commands);
    cmds.forEach((cmd) => cmd(program, app));
});
// parses and closes the command
commander.destroy = () => __awaiter(void 0, void 0, void 0, function* () {
    yield program.parseAsync();
});
module.exports = commander;
