import 'colors';

export const newline = () => console.log();

export const info = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return warning(msg1);
	}
	return console.log('>', msg1.blue, '→', msg2);
};

export const success = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return console.log('>', msg1.green);
	} else {
		return console.log('>', msg1.green, '→', msg2);
	}
};

export const error = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		console.log('>', msg1.red);
	} else {
		console.log('>', msg1.red, '→', msg2);
	}
};

export const json = (msg1: string) => console.log(msg1.green);

export const warning = (msg1: string, msg2: string = '') => {
	if (!msg2 || msg2 === '') {
		return console.log('>', msg1.yellow);
	}
	return console.log('>', msg1.yellow, '→', msg2);
};
