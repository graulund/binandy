import { transactionFeeLevels } from "../constants";

export function getExitGains(valueIn: number, originalValueIn: number) {
	const gains = valueIn - originalValueIn;

	return transactionFeeLevels.map((fee) => {
		const gainsPostFee = gains - (valueIn * fee);

		return {
			feeLevel: fee,
			gainsPostFee,
		};
	});
}

export function getLocalExitGains(localValueIn: number, originalLocalValueIn: number) {
	const localGains = localValueIn - originalLocalValueIn;

	return transactionFeeLevels.map((fee) => {
		const gainsPostFee = localGains - (localValueIn * fee);

		return {
			feeLevel: fee,
			gainsPostFee,
		};
	});
}

export function createRequiredPriceForDesiredHoldingsCalc(
	currentAmountIn: number,
	currentAmountToSpend: number
) {
	return function getRequiredPriceForDesiredHoldings(
		desiredHoldings: number
	) {
		return (desiredHoldings - currentAmountToSpend) / currentAmountIn;
	};
}

export function createRequiredPriceForDesiredLocalHoldingsCalc(
	currentAmountIn: number,
	currentAmountToSpend: number,
	localCurrencyRate: number
) {
	return function getRequiredPriceForDesiredLocalHoldings(
		desiredLocalHoldings: number
	) {
		return (desiredLocalHoldings / localCurrencyRate - currentAmountToSpend)
			/ currentAmountIn;
	};
}

export function createRequiredPriceForDesiredAmountCalc(
	currentAmountToSpend: number
) {
	return function getRequiredPriceForDesiredAmount(desiredAmount: number) {
		return currentAmountToSpend / desiredAmount;
	}
}

export function createHypotheticalHoldingsCalc(
	currentAmountToSpend: number,
	closePrice: number
) {
	return function getHypotheticalHoldings(hypotheticalAmountIn: number) {
		return hypotheticalAmountIn * closePrice + currentAmountToSpend;
	};
}

export function createHypotheticalLocalHoldingsCalc(
	currentAmountToSpend: number,
	closePrice: number,
	localCurrencyRate: number
) {
	return function getHypotheticalLocalHoldings(hypotheticalAmountIn: number) {
		return localCurrencyRate * (
			hypotheticalAmountIn * closePrice + currentAmountToSpend
		);
	}
}

export function createHoldingsAtHypotheticalPriceCalc(
	currentAmountIn: number,
	currentAmountToSpend: number
) {
	return function getHoldingsAtHypotheticalPrice(
		hypotheticalPrice: number
	) {
		return currentAmountIn * hypotheticalPrice + currentAmountToSpend;
	};
}

export function createLocalHoldingsAtHypotheticalPriceCalc(
	currentAmountIn: number,
	currentAmountToSpend: number,
	localCurrencyRate: number
) {
	return function getLocalHoldingsAtHypotheticalPrice(
		hypotheticalPrice: number
	) {
		return localCurrencyRate * (
			currentAmountIn * hypotheticalPrice + currentAmountToSpend
		);
	};
}
