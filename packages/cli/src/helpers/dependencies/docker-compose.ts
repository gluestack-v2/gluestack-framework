import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

const dockerCompose = async (): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		const _spawn: ChildProcessWithoutNullStreams = spawn(
			'docker',
			['compose', '-v'],
			process.platform === 'win32'
				? { shell: true }
				: { shell: false }
		);

		_spawn.on('error', () => {
			return reject(`"DOCKER COMPOSE" is installed?`);
		});

		_spawn.on('exit', (result) => {
			if (result) {
				return reject(`"DOCKER COMPOSE" is installed?`);
			}
			return resolve(`"DOCKER COMPOSE" is installed?`);
		});
	});

export { dockerCompose };
