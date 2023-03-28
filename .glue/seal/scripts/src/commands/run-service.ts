import { Command, Option } from 'commander';
import action from '../actions/run-service';

export default async (program: Command) => {
	const platformOption: Option = new Option(
		'-p, --platform <platform>',
		'platform name to run the service on'
	).choices([
		'docker', 'local'
	]);

	program
		.command('run:service')
		.argument('<directory-name>', 'directory path to the service containing "seal.service.yaml" file')
		.addOption(platformOption.makeOptionMandatory())
		.option('-e, --ports [ports...]', 'ports mapping in case platform is docker', [])
		.description('runs a service from the gluestack project')
		.action(action);
};
