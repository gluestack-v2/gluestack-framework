import { spawn, SpawnOptions } from 'child_process';

const yarn = async (): Promise<string> =>
	new Promise((resolve, reject) => {
		const options: SpawnOptions =
			process.platform === 'win32'
				? { shell: true }
				: { shell: false };

		const _spawn = spawn('yarn', ['-v'], options);

		_spawn.on('error', () => {
			return reject(`"YARN" is installed?`);
		});

		_spawn.on('exit', (result) => {
			if (result) {
				return reject(`"YARN" is installed?`);
			}
			return resolve(`"YARN" is installed?`);
		});
	});

export { yarn };
