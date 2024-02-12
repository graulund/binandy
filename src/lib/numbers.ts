export function getHundredFromValue(value: number) {
	return Math.floor(value / 100) * 100;
}

export function getThousandFromValue(value: number) {
	return Math.floor(value / 1000) * 1000;
}

export function floorToNthDecimal(value: number, n: number) {
	const factor = Math.pow(10, n);
	return Math.floor(value * factor) / factor;
}
