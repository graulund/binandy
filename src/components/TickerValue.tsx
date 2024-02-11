import clsx from "clsx";

import useSubtle from "../hooks/useSubtle";

import {
	formatCryptoAmount,
	formatCurrency,
	formatLocalCurrency
} from "../lib/formatNumbers";

import styles from "./TickerValue.module.css";

type TickerValueProps = {
	isCryptoValue?: boolean;
	isDifference?: boolean;
	isDown?: boolean;
	isLocalValue?: boolean;
	isUp?: boolean;
	size?: "normal" | "small";
	value: number;
	withSymbol?: boolean;
};

function getFormattedValue({
	isCryptoValue,
	isLocalValue,
	value
}: Pick<TickerValueProps, "isCryptoValue" | "isLocalValue" | "value">) {
	if (isCryptoValue) {
		return formatCryptoAmount(value);
	}

	if (isLocalValue) {
		return formatLocalCurrency(value);
	}

	return formatCurrency(value);
}

export default function TickerValue({
	isCryptoValue,
	isDifference,
	isDown,
	isLocalValue,
	isUp,
	size,
	value,
	withSymbol
}: TickerValueProps) {
	const subtle = useSubtle();

	const formattedValue = getFormattedValue({
		isCryptoValue,
		isLocalValue,
		value
	});

	const className = clsx(styles.value, {
		[styles.subtleValue]: subtle,
		[styles.smallValue]: size === "small",
		[styles.valueWithSymbol]: withSymbol,
		[styles.differenceAbove]: isDifference && value > 0,
		[styles.differenceBelow]: isDifference && value < 0
	});

	return (
		<div className={className}>
			<span>
				{isDifference && value > 0 && "+"}
				{formattedValue}
			</span>
			{withSymbol && (
				<span className={styles.valueSymbol}>
					{isUp && (
						<span className={styles.arrowUp}>
							↑
						</span>
					)}
					{isDown && (
						<span className={styles.arrowDown}>
							↓
						</span>
					)}
				</span>
			)}
		</div>
	);
}
