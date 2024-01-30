import { useCallback, useContext, useEffect } from "react";
import clsx from "clsx";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import UserDerivedData from "../contexts/UserDerivedData";
import setDocTitle from "../lib/docTitle";

import styles from "./Ticker.module.css";

const localCurrencyFormatter = new Intl.NumberFormat(
	"da-DK", { style: "currency", currency: "DKK" }
);

const currencyFormatter = new Intl.NumberFormat(
	"en-US", { style: "currency", currency: "USD" }
);

export default function Ticker() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);
	const userDerivedData = useContext(UserDerivedData.Context);

	const { amountIn = 0, setAppData } = appData || {};
	const { valueIn = 0, localValueIn = 0 } = userDerivedData || {};
	const price = tickerData?.closePrice;

	const handleNewAmountIn = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountIn = Number(evt.target.value);

		if (typeof setAppData === "function") {
			setAppData({ amountIn: newAmountIn });
		}
	}, [setAppData]);

	useEffect(() => setDocTitle(
		price && localValueIn && localValueIn > 0
			? localCurrencyFormatter.format(localValueIn)
			: ""
	), [price, localValueIn]);

	if (!price || !appData || !userDerivedData) {
		return null;
	}

	return (
		<div className={styles.ticker}>
			<div className={styles.label}>
				Current BTC/USDT price:
			</div>
			<div className={clsx(styles.value, styles.valueWithSymbol)}>
				<span>{currencyFormatter.format(price)}</span>
				<span className={styles.valueSymbol}>
					{tickerData?.isUp && (
						<span className={styles.arrowUp}>
							↑
						</span>
					)}
					{tickerData?.isDown && (
						<span className={styles.arrowDown}>
							↓
						</span>
					)}
				</span>
			</div>
			<div className={styles.label}>
				<label htmlFor="amount-in-input">
					Your BTC amount in:
				</label>
			</div>
			<div className={styles.valueInput}>
				<input
					id="amount-in-input"
					type="number"
					value={amountIn}
					onChange={handleNewAmountIn}
				/>
			</div>
			{amountIn > 0 && (
				<>
					<div className={styles.label}>
						Your holdings:
					</div>
					<div className={styles.value}>
						{currencyFormatter.format(valueIn)}
					</div>
					<div className={styles.label}>
						Which is:
					</div>
					<div className={styles.value}>
						{localCurrencyFormatter.format(localValueIn)}
					</div>
				</>
			)}
		</div>
	);
}
