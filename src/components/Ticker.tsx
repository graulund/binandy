import { useCallback, useContext, useEffect, useState } from "react";
import clsx from "clsx";

import { TickerContext } from "../contexts/TickerData";
import setDocTitle from "../lib/docTitle";
import { localCurrencyRate } from "../constants";

import styles from "./Ticker.module.css";

const amountInLocalStorageName = "binandy.amount-in";

const localCurrencyFormatter = new Intl.NumberFormat(
	"da-DK", { style: "currency", currency: "DKK" }
);

const currencyFormatter = new Intl.NumberFormat(
	"en-US", { style: "currency", currency: "USD" }
);

export default function Ticker() {
	const data = useContext(TickerContext);
	const [amountIn, setAmountIn] = useState(0);

	const price = data?.closePrice;

	const handleNewAmountIn = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountIn = Number(evt.target.value);
		setAmountIn(newAmountIn);

		try {
			localStorage.setItem(amountInLocalStorageName, String(newAmountIn));
		} catch (err) {
			console.error(err);
		}
	}, []);

	useEffect(() => {
		try {
			const amountInFromLocalStorage = localStorage.getItem(amountInLocalStorageName);

			if (amountInFromLocalStorage) {
				setAmountIn(Number(amountInFromLocalStorage));
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	useEffect(() => setDocTitle(
		price && amountIn > 0
			? localCurrencyFormatter.format(amountIn * price * localCurrencyRate)
			: ""
	), [price, amountIn]);

	if (!price) {
		return null;
	}

	const valueClassName = clsx(styles.value, {
		[styles.valueUp]: data?.isUp
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
