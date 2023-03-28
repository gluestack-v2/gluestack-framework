"use strict";
const { Command, CommanderError } = require('commander');
const { version } = require('../../package.json');
const program = new Command();
const commander = {};
// initialize the glue command
commander.init = () => {
    if (process.argv.length === 2) {
        process.argv.push('-h');
    }
    program
        .name('glue')
        .version('Gluestack Version ' + version)
        .description('Gluestack V2 Framework CLI');
};
// inject the command into the commander
commander.addCommand = (app, cmd) => {
    cmd(program, app);
};
// parses and closes the command
commander.destroy = () => {
    program.exitOverride();
    try {
        program.parse();
    }
    catch (err) {
        if (err instanceof CommanderError) {
            if (err.exitCode !== 0) {
                throw new Error(err);
            }
        }
        else {
            throw new Error(err);
        }
    }
};
module.exports = commander;
