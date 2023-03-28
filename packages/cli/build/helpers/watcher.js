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
const chokidar = require('chokidar');
const watcher = {};
watcher.watch = (cwd, pattern, callback) => {
    const globs = typeof pattern === 'string'
        ? [pattern] : pattern;
    console.log(`Watching ${cwd} for changes...`);
    console.log(globs);
    try {
        chokidar
            .watch(globs, {
            persistent: true,
            cwd: cwd,
            ignored: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/.next/**',
            ]
        })
            .on('all', (event, path) => __awaiter(void 0, void 0, void 0, function* () { return console.log('>> here'); }));
    }
    catch (err) {
        console.log('> error', err);
    }
};
module.exports = watcher;
