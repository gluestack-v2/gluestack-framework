import { spawn } from 'child_process';

const tsc = async (): Promise<string> => {
	return new Promise((resolve, reject) => {
		const _spawn = spawn(
			'tsc',
			['-v'],
			process.platform === 'win32'
				? { shell: true }
				: { shell: false }
		);

		_spawn.on('error', () => {
			reject(`"TYPESCRIPT" is installed?`);
		});

		_spawn.stdout.on('data', (data) => {
			const version = data
				.toString()
				.replace(/[^\d.]/g, '')
				.replace(/\.\d+/g, '');

			if (version < '4') {
				reject(
					`"TYPESCRIPT" version must be greater than or equal to 4`
				);
			} else {
				resolve(`"TYPESCRIPT" is installed?`);
			}
		});

		_spawn.on('exit', (result) => {
			if (result) {
				reject(`"TYPESCRIPT" is installed?`);
			}
		});
	});
};

export { tsc };
