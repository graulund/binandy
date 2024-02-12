import { z } from "zod";

import { currencyRatesUrl, defaultCurrencyCode } from "../constants";

const currencyRatesPayloadScheme = z.array(
	z.object({
		currencyCode: z.string(),
		inboundRate: z.number(),
		updated: z.string().nullable()
	})
);

export type CurrencyRateInfo = {
	rate: number;
	updated: Date | null;
};

export default async function fetchLocalCurrencyRate(): Promise<CurrencyRateInfo | null> {
	const response = await fetch(currencyRatesUrl);
	const data = await response.json();
	const currencyRates = currencyRatesPayloadScheme.parse(data);

	// Note: All rates in list are relative to the local currency code
	// So we look up the one in relation to our default

	const localCurrencyRate = currencyRates.find(
		(rate) => rate.currencyCode === defaultCurrencyCode
	);

	if (localCurrencyRate) {
		return {
			rate: localCurrencyRate.inboundRate,
			updated: localCurrencyRate.updated
				? new Date(localCurrencyRate.updated)
				: null
		};
	}

	return null;
}
