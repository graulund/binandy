import clsx from "clsx";

import { formatCurrency, formatLocalCurrency } from "../lib/currencies";

import styles from "./TickerValue.module.css";

type TickerValueProps = {
	value: number;
	isLocalValue?: boolean;
	withSymbol?: boolean;
	isUp?: boolean;
	isDown?: boolean;
};

export default function TickerValue({
	value,
	isLocalValue,
	withSymbol,
	isUp,
	isDown
}: TickerValueProps) {
	const formattedValue = isLocalValue
		? formatLocalCurrency(value)
		: formatCurrency(value);

	const className = withSymbol
		? clsx(styles.value, styles.valueWithSymbol)
		: styles.value;

	return (
		<div className={className}>
			<span>{formattedValue}</span>
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
