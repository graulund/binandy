import { productName } from "../constants";

export function getDocTitle(prefix?: string) {
	if (prefix) {
		return `${prefix} | ${productName}`;
	}

	return productName;
}

export default function setDocTitle(prefix?: string) {
	if (typeof document === "object") {
		document.title = getDocTitle(prefix);
	}
}
