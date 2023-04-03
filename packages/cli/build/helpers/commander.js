(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "commander", "../../package.json"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commander_1 = require("commander");
    // @ts-ignore
    const package_json_1 = require("../../package.json");
    const program = new commander_1.Command();
    const commander = {};
    // initialize the glue command
    commander.init = () => {
        if (process.argv.length === 2) {
            process.argv.push('-h');
        }
        program
            .name('glue')
            .version('Gluestack Version ' + package_json_1.version)
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
            if (err instanceof commander_1.CommanderError) {
                if (err.exitCode !== 0) {
                    throw new Error(err.message);
                }
            }
            else {
                throw new Error(err);
            }
        }
    };
    exports.default = commander;
});
