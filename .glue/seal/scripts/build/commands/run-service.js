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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const run_service_1 = __importDefault(require("../actions/run-service"));
exports.default = (program) => __awaiter(void 0, void 0, void 0, function* () {
    const platformOption = new commander_1.Option('-p, --platform <platform>', 'platform name to run the service on').choices([
        'docker', 'local'
    ]);
    program
        .command('run:service')
        .argument('<directory-name>', 'directory path to the service containing "seal.service.yaml" file')
        .addOption(platformOption.makeOptionMandatory())
        .option('-e, --ports [ports...]', 'ports mapping in case platform is docker', [])
        .description('runs a service from the gluestack project')
        .action(run_service_1.default);
});
