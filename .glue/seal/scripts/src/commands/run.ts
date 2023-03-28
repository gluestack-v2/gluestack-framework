import { Command } from 'commander';
import action from '../actions/run';

export default async (program: Command) => {
	program
		.command('run')
		.description('runs all the services from the gluestack project')
		.action(action);
};
