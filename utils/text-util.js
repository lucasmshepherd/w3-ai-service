export const makeResponse = (text, maxLength = 4096) => {
	if (text.length < maxLength)
		return text;

	let result = '';
	const sentences = text.split('\n');
	for (let i = 0; i < sentences.length && (result + '\n' + sentences[i]).length < maxLength; i++) {
		result = result + '\n' + sentences[i];
	}

	return result;
}
