export function times<T = unknown>(n: number, callback: (n: number) => T): T[] {
	const result: T[] = [];

	for (let i = 0; i < n; i++) {
		result.push(callback(i));
	}

	return result;
}
