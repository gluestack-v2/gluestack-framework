import { error } from '../print';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

const docker = async (): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		const _spawn: ChildProcessWithoutNullStreams = spawn(
			'docker',
			['--version'],
			process.platform === 'win32'
				? { shell: true }
				: { shell: false }
		);

		let dockerVersion = '';

		_spawn.on('error', () => {
			return reject(`"DOCKER" is installed?`);
		});

		_spawn.stdout.on('data', (data) => {
			dockerVersion += data.toString();
		});

		_spawn.on('exit', (result) => {
			if (result) {
				return reject(`"DOCKER" is installed?`);
			}
			const versionMatch = dockerVersion.match(/(\d+)\.\d+/);
			const data = versionMatch?.[0] as string;
			const version = data.toString().split('.');
			version.splice(2);

			if (+version[0] < 20) {
				throw new Error(
					`"Docker" version must be greater than or equal 20`
				);
			}

			if (+version[0] <= 20 && +version[1] < 10) {
				throw new Error(
					`"Docker" version must be greater than or equal 20`
				);
			}

			return resolve(`"DOCKER" is installed?`);
		});
	});

export { docker };
