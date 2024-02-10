export function getHundredFromValue(value: number) {
	return Math.floor(value / 100) * 100;
}

export function getThousandFromValue(value: number) {
	return Math.floor(value / 1000) * 1000;
}
