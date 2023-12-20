export function convertToReadableDate(date: Date): string {
	const readableDate: string = date.toLocaleString();
	return readableDate;
}

export const sortUserId = (idArr: string[]) => {
	function compareHexStrings(a: string, b: string) {
		return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
	}

	const sortedIds = idArr.sort(compareHexStrings);

	return sortedIds;
};
