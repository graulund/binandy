import memoizeOne from "memoize-one";

import { AppConfig } from "./appConfig";
import { TickerEventData } from "./tickerData";
import { transactionFeeLevels } from "../constants";

type GainsWithFee = {
	gainsPostFee: number;
	feeLevel: number;
};

export type DerivedValues = {
	exitGains: GainsWithFee[] | null;
	gains: number | null;
	getNeededPriceForDesiredHoldings: (desiredHoldings: number) => number;
	getNeededPriceForDesiredLocalHoldings: (desiredLocalHoldings: number) => number;
	holdings: number;
	localAmountToSpend: number;
	localExitGains: GainsWithFee[] | null;
	localGains: number | null;
	localHoldings: number;
	localValueIn: number;
	maxBuy: number;
	originalLocalValueIn: number | null;
	originalValueIn: number | null;
	valueIn: number;
};

function createNeededPriceCalculator(
	currentAmountIn: number,
	currentAmountToSpend: number
) {
	return function getNeededPriceForDesiredHoldings(
		desiredHoldings: number
	) {
		return (desiredHoldings - currentAmountToSpend) / currentAmountIn;
	}
}

function createNeededPriceLocalCalculator(
	currentAmountIn: number,
	currentAmountToSpend: number,
	localCurrencyRate: number
) {
	return function getNeededPriceForDesiredLocalHoldings(
		desiredLocalHoldings: number
	) {
		return (desiredLocalHoldings / localCurrencyRate - currentAmountToSpend)
			/ currentAmountIn;
	}
}

const memoizedCreateNeededPriceCalculator = memoizeOne(createNeededPriceCalculator);
const memoizedCreateNeededPriceLocalCalculator = memoizeOne(createNeededPriceLocalCalculator);

export default function getDerivedData(
	localCurrencyRate: number,
	config: AppConfig | null,
	tickerData: TickerEventData | null
): DerivedValues | null {
	if (!config || !tickerData) {
		return null;
	}

	const { amountIn, amountToSpend, originalPrice } = config;
	const { closePrice } = tickerData;

	const valueIn = amountIn * closePrice;
	const localValueIn = valueIn * localCurrencyRate;
	const localAmountToSpend = amountToSpend * localCurrencyRate;

	let value: DerivedValues = {
		exitGains: null,
		gains: null,
		getNeededPriceForDesiredHoldings: memoizedCreateNeededPriceCalculator(
			amountIn,
			amountToSpend
		),
		getNeededPriceForDesiredLocalHoldings: memoizedCreateNeededPriceLocalCalculator(
			amountIn,
			amountToSpend,
			localCurrencyRate
		),
		holdings: valueIn + amountToSpend,
		localAmountToSpend,
		localExitGains: null,
		localGains: null,
		localHoldings: localValueIn + localAmountToSpend,
		localValueIn,
		maxBuy: amountToSpend / closePrice,
		originalLocalValueIn: null,
		originalValueIn: null,
		valueIn
	};

	if (originalPrice && originalPrice > 0) {
		const originalValueIn = originalPrice * amountIn;
		const originalLocalValueIn = originalPrice * amountIn * localCurrencyRate;

		const gains = valueIn - originalValueIn;
		const localGains = localValueIn - originalLocalValueIn;

		const exitGains = transactionFeeLevels.map((fee) => {
			const gainsPostFee = gains - (valueIn * fee);

			return {
				feeLevel: fee,
				gainsPostFee,
			};
		});

		const localExitGains = transactionFeeLevels.map((fee) => {
			const gainsPostFee = localGains - (localValueIn * fee);

			return {
				feeLevel: fee,
				gainsPostFee,
			};
		});

		value = {
			...value,
			exitGains,
			gains,
			localExitGains,
			localGains,
			originalLocalValueIn,
			originalValueIn
		};
	}


	return value;
}
