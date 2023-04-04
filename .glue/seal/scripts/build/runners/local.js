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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const execute_1 = require("../helpers/execute");
class Local {
    constructor(servicePath, build) {
        this.build = build;
        this.volume = (0, path_1.join)(servicePath);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [
                '-c',
                this.build
            ];
            yield (0, execute_1.execute)('sh', args, {
                cwd: this.volume,
                stdio: 'inherit'
            });
        });
    }
    static start(servicePath, build) {
        return __awaiter(this, void 0, void 0, function* () {
            const local = new Local(servicePath, build);
            yield local.run();
        });
    }
}
exports.default = Local;
