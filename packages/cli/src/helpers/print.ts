import colors from 'colors/safe';

export const newline = () => console.log();

export const info = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return warning(msg1);
	}
	return console.log('>', colors.blue(msg1), '→', msg2);
};

export const success = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return console.log('>', colors.green(msg1));
	} else {
		return console.log('>', colors.green(msg1), '→', msg2);
	}
};

export const error = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		console.log('>', colors.red(msg1));
	} else {
		console.log('>', colors.red(msg1), '→', msg2);
	}
};

export const json = (msg1: string) => console.log(colors.green(msg1));

export const warning = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return console.log('>', colors.yellow(msg1));
	}
	return console.log('>', colors.yellow(msg1), '→', msg2);
};
