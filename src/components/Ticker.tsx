import { useCallback, useContext, useEffect } from "react";
import clsx from "clsx";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import setDocTitle from "../lib/docTitle";
import { localCurrencyRate } from "../constants";

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

	if (!appData) {
		throw new Error("Missing app data");
	}

	const { amountIn, setAppData } = appData;
	const price = tickerData?.closePrice;

	const handleNewAmountIn = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountIn = Number(evt.target.value);
		setAppData({ amountIn: newAmountIn });
	}, [setAppData]);

	useEffect(() => setDocTitle(
		price && amountIn > 0
			? localCurrencyFormatter.format(amountIn * price * localCurrencyRate)
			: ""
	), [price, amountIn]);

	if (!price) {
		return null;
	}

	const valueClassName = clsx(styles.value, {
		[styles.valueUp]: tickerData?.isUp
	});

	return (
		<div className={styles.ticker}>
			<div className={styles.label}>
				Current BTC/USDT price:
			</div>
			<div className={valueClassName}>
				{currencyFormatter.format(price)}
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
					<div className={valueClassName}>
						{currencyFormatter.format(amountIn * price)}
					</div>
					<div className={styles.label}>
						Which is:
					</div>
					<div className={valueClassName}>
						{localCurrencyFormatter.format(amountIn * price * localCurrencyRate)}
					</div>
				</>
			)}
		</div>
	);
}
