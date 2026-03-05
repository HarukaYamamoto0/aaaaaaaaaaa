// biome-ignore lint/suspicious/noExplicitAny: any buffer
export const isBuffer = (obj: any) => !!obj && obj instanceof Uint8Array;

export function bufferStartsWith(buffer: Buffer, searchString: string | Buffer, position = 0): boolean {
	const search = typeof searchString === 'string' ? Buffer.from(searchString) : searchString;

	if (position < 0 || position + search.length > buffer.length) {
		return false;
	}

	return buffer.subarray(position, position + search.length).equals(search);
}
