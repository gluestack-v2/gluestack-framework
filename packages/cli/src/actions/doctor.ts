import {
	yarn,
	docker,
	dockerCompose,
	hasura,
	node,
	dockerStatus,
	npm,
} from '../helpers/dependencies';
import { info, error } from '../helpers/print';

const runDoctor = async (): Promise<void> => {
	const results = await Promise.allSettled([
		node(),
		npm(),
		yarn(),
		hasura(),
		docker(),
		dockerCompose(),
		dockerStatus(),
	]);

	let failed = false;

	results.forEach((result: any) => {
		if (result.status === 'rejected' && result.reason) {
			info(result.reason, 'NO'.red);
			failed = true;
		}

		if (result.status === 'fulfilled') {
			info(result.value, 'YES'.brightGreen);
		}
	});
	if (failed) {
		error(`Pre-Requisites check for installation failed.`);
		process.exit(0);
	}
};

export default runDoctor;
