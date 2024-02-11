import {
	defaultCurrencyCode,
	localCurrencyLocale,
	localCurrencyCode
} from "../constants";

const localCurrencyFormatter = new Intl.NumberFormat(
	localCurrencyLocale, { style: "currency", currency: localCurrencyCode }
);

const currencyFormatter = new Intl.NumberFormat(
	"en-US", { style: "currency", currency: defaultCurrencyCode }
);

export function formatCurrency(amount: number) {
	return currencyFormatter.format(amount);
}

export function formatLocalCurrency(localAmount: number) {
	return localCurrencyFormatter.format(localAmount);
}

export function formatCryptoAmount(amount: number) {
	return amount.toFixed(8);
}
