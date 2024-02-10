import { localCurrencyRate } from "../constants";
import { AppConfig } from "./appConfig";
import { TickerEventData } from "./tickerData";

export type DerivedValues = {
	localValueIn: number;
	originalLocalValueIn: number | null;
	originalValueIn: number | null;
	valueIn: number;
};

export default function getDerivedData(
	config: AppConfig | null,
	tickerData: TickerEventData | null
): DerivedValues | null {
	if (!config || !tickerData) {
		return null;
	}

	const { amountIn, originalPrice } = config;
	const { closePrice } = tickerData;

	const value: DerivedValues = {
		localValueIn: amountIn * closePrice * localCurrencyRate,
		originalLocalValueIn: null,
		originalValueIn: null,
		valueIn: amountIn * closePrice,
	};

	if (originalPrice && originalPrice > 0) {
		value.originalValueIn = originalPrice * amountIn;
		value.originalLocalValueIn = originalPrice * amountIn * localCurrencyRate;
	}

	return value;
}
