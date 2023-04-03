import { Command, CommanderError } from 'commander';

// @ts-ignore
import { version } from '../../package.json';

import AppCLI from '../helpers/lib/app';
import ICommander from '../types/helpers/interface/ICommander';
import IProgramCallback from '../types/helpers/interface/ICommandCallback';

const program: Command = new Command();
const commander = {} as ICommander;

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
commander.addCommand = (app: AppCLI, cmd: IProgramCallback) => {
	cmd(program, app);
};

// parses and closes the command
commander.destroy = () => {
	program.exitOverride();
	try {
		program.parse();
	} catch (err: any) {
		if (err instanceof CommanderError) {
			if (err.exitCode !== 0) {
				throw new Error(err.message);
			}
		} else {
			throw new Error(err);
		}
	}
};

export default commander;
