export const makeResponse = (text, maxLength = 4096) => {
	if (text.length < maxLength)
		return [text];

	let result = '';
	const responses = [];
	const sentences = text.split('\n');
	for (let i = 0; i < sentences.length; i++) {
		if ((result + '\n' + sentences[i]).length >= 4096) {
			responses.push(result);
			result = sentences[i];
		} else {
			result = result + '\n' + sentences[i];
		}
	}

	if (result) {
		responses.push(result);
	}

	return responses;
}
