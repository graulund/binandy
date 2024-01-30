import { localCurrencyLocale, localCurrencyName, localCurrencyRate } from "../constants";

const localCurrencyFormatter = new Intl.NumberFormat(
	localCurrencyLocale, { style: "currency", currency: localCurrencyName }
);

const currencyFormatter = new Intl.NumberFormat(
	"en-US", { style: "currency", currency: "USD" }
);

export function formatCurrency(amount: number) {
	return currencyFormatter.format(amount);
}

export function formatLocalCurrency(localAmount: number) {
	return localCurrencyFormatter.format(localAmount);
}

export function convertToLocalCurrency(amount: number) {
	return amount * localCurrencyRate;
}

export function convertFromLocalCurrency(localAmount: number) {
	return localAmount / localCurrencyRate;
}
