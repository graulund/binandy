import memoizeOne from "memoize-one";

import { AppConfig } from "./appConfig";
import {
	createHoldingsAtHypotheticalPriceCalc as createHoldingsAtHypothPriceCalc,
	createHypotheticalHoldingsCalc as createHypothHoldingsCalc,
	createHypotheticalLocalHoldingsCalc as createHypothLocalHoldingsCalc,
	createLocalHoldingsAtHypotheticalPriceCalc as createLocalHoldingsAtHypothPriceCalc,
	createRequiredPriceForDesiredAmountCalc as createReqPriceForAmountCalc,
	createRequiredPriceForDesiredHoldingsCalc as createReqPriceCalc,
	createRequiredPriceForDesiredLocalHoldingsCalc as createReqPriceLocalCalc,
	getExitGains as getExitGainsCalc,
	getLocalExitGains as getLocalExitGainsCalc
} from "./calculators";
import { TickerEventData } from "./tickerData";

type GainsWithFee = {
	gainsPostFee: number;
	feeLevel: number;
};

export type DerivedValues = {
	exitGains: GainsWithFee[] | null;
	gains: number | null;
	getHoldingsAtHypotheticalPrice: (hypotheticalPrice: number) => number;
	getLocalHoldingsAtHypotheticalPrice: (hypotheticalPrice: number) => number;
	getHypotheticalHoldings: (hypotheticalAmountIn: number) => number;
	getHypotheticalLocalHoldings: (hypotheticalAmountIn: number) => number;
	getRequiredPriceForDesiredAmount: (desiredAmount: number) => number;
	getRequiredPriceForDesiredHoldings: (desiredHoldings: number) => number;
	getRequiredPriceForDesiredLocalHoldings: (desiredLocalHoldings: number) => number;
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

// Memoize calculator creation functions
const createRequiredPriceForDesiredAmountCalc = memoizeOne(createReqPriceForAmountCalc);
const createRequiredPriceForDesiredHoldingsCalc = memoizeOne(createReqPriceCalc);
const createRequiredPriceForDesiredLocalHoldingsCalc = memoizeOne(createReqPriceLocalCalc);
const createHypotheticalHoldingsCalc = memoizeOne(createHypothHoldingsCalc);
const createHypotheticalLocalHoldingsCalc = memoizeOne(createHypothLocalHoldingsCalc);
const createHoldingsAtHypotheticalPriceCalc = memoizeOne(createHoldingsAtHypothPriceCalc);
const createLocalHoldingsAtHypotheticalPriceCalc = memoizeOne(createLocalHoldingsAtHypothPriceCalc);
const getExitGains = memoizeOne(getExitGainsCalc);
const getLocalExitGains = memoizeOne(getLocalExitGainsCalc);

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
		getHoldingsAtHypotheticalPrice: createHoldingsAtHypotheticalPriceCalc(
			amountIn,
			amountToSpend
		),
		getHypotheticalHoldings: createHypotheticalHoldingsCalc(
			amountToSpend,
			closePrice
		),
		getHypotheticalLocalHoldings: createHypotheticalLocalHoldingsCalc(
			amountToSpend,
			closePrice,
			localCurrencyRate
		),
		getLocalHoldingsAtHypotheticalPrice: createLocalHoldingsAtHypotheticalPriceCalc(
			amountIn,
			amountToSpend,
			localCurrencyRate
		),
		getRequiredPriceForDesiredAmount: createRequiredPriceForDesiredAmountCalc(
			amountToSpend
		),
		getRequiredPriceForDesiredHoldings: createRequiredPriceForDesiredHoldingsCalc(
			amountIn,
			amountToSpend
		),
		getRequiredPriceForDesiredLocalHoldings: createRequiredPriceForDesiredLocalHoldingsCalc(
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
		const exitGains = getExitGains(valueIn, originalValueIn);
		const localExitGains = getLocalExitGains(localValueIn, originalLocalValueIn);

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
