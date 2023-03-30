const removeSpecialChars = (str: string) =>
	str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

export default removeSpecialChars;
