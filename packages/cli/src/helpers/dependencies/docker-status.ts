import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

const dockerStatus = async (): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		const _spawn: ChildProcessWithoutNullStreams = spawn('docker', [
			'info',
			'-f',
			`'{{ json .}}'`,
		]);

		let data = '';

		_spawn.on('error', () => {
			return reject(`"DOCKER" is running?`);
		});

		_spawn.stdout.on('data', async (response) => (data += response));

		_spawn.on('exit', (result) => {
			if (result) {
				return reject(`"DOCKER" is running?`);
			}
			data.includes('ServerErrors')
				? reject(`"DOCKER" is running?`)
				: resolve(`"DOCKER" is running?`);
		});
	});

export { dockerStatus };
