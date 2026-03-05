export function bufferStartsWith(buffer: Buffer, searchString: string | Buffer, position = 0): boolean {
	const search = typeof searchString === 'string' ? Buffer.from(searchString) : searchString;

	if (position < 0 || position + search.length > buffer.length) {
		return false;
	}

	return buffer.subarray(position, position + search.length).equals(search);
}
