export function removeNullValues(obj: Record<string, any>): Record<string, any> {
	const result: Record<string, any> = {};

	for (const key in obj) {
		if (obj[key] !== null) {
			result[key] = obj[key];
		}
	}

	return result;
}

function removeNullValuesFromArray(
	arr: Record<string, any>[],
	keyToRemove: string
): Record<string, any>[] {
	return arr.filter((obj) => obj[keyToRemove] !== null);
}
