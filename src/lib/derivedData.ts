import { localCurrencyRate, transactionFeeLevels } from "../constants";
import { AppConfig } from "./appConfig";
import { TickerEventData } from "./tickerData";

type GainsWithFee = {
	gainsPostFee: number;
	feeLevel: number;
};

export type DerivedValues = {
	exitGains: GainsWithFee[] | null;
	gains: number | null;
	localExitGains: GainsWithFee[] | null;
	localGains: number | null;
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

	let value: DerivedValues = {
		exitGains: null,
		gains: null,
		localExitGains: null,
		localGains: null,
		localValueIn: amountIn * closePrice * localCurrencyRate,
		originalLocalValueIn: null,
		originalValueIn: null,
		valueIn: amountIn * closePrice,
	};

	if (originalPrice && originalPrice > 0) {
		const { localValueIn, valueIn } = value;

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
