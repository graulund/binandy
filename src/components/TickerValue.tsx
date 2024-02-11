import clsx from "clsx";

import { formatCurrency, formatLocalCurrency } from "../lib/formatCurrencies";

import styles from "./TickerValue.module.css";

type TickerValueProps = {
	isDifference?: boolean;
	isDown?: boolean;
	isLocalValue?: boolean;
	isUp?: boolean;
	size?: "normal" | "small";
	value: number;
	withSymbol?: boolean;
};

export default function TickerValue({
	isDifference,
	isDown,
	isLocalValue,
	isUp,
	size,
	value,
	withSymbol
}: TickerValueProps) {
	const formattedValue = isLocalValue
		? formatLocalCurrency(value)
		: formatCurrency(value);

	const className = clsx(styles.value, {
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
