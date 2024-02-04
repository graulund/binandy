
import { useContext, useEffect, useState } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import UserDerivedData from "../contexts/UserDerivedData";
import { formatCurrency, formatLocalCurrency } from "../lib/currencies";
import { localCurrencyRate } from "../constants";

import styles from "./MoneyThermometer.module.css";

function getViewportPositionFromValue(
	value: number,
	midValue: number,
	viewportHeight: number
) {
	return viewportHeight - (viewportHeight / 2 + (value - midValue));
}

function getHundredFromValue(value: number) {
	return Math.floor(value / 100) * 100;
}

export default function MoneyThermometer() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);
	const userDerivedData = useContext(UserDerivedData.Context);
	const [viewportHeight, setViewportHeight] = useState(0);

	const { amountIn = 0 } = appData || {};
	const { localValueIn = 0 } = userDerivedData || {};
	const price = tickerData?.closePrice;

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const onResize = () => {
			setViewportHeight(window.innerHeight);
		};

		window.addEventListener("resize", onResize);
		onResize();

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	if (!price || !appData || !userDerivedData || amountIn <= 0) {
		return null;
	}

	const currentHundred = getHundredFromValue(localValueIn);
	const hundreds = [];

	if (currentHundred !== Math.round(localValueIn)) {
		hundreds.push(currentHundred);
	}

	// Add all hundreds available on screen around the current value

	let markerValue = localValueIn;

	let position = getViewportPositionFromValue(
		markerValue,
		localValueIn,
		viewportHeight
	);

	while (position > 0 && position < viewportHeight) {
		markerValue -= 100 *
			(1 + ((markerValue - getHundredFromValue(markerValue)) / 100));

		position = getViewportPositionFromValue(
			markerValue,
			localValueIn,
			viewportHeight
		);

		hundreds.push(markerValue);
	}

	markerValue = localValueIn;

	position = getViewportPositionFromValue(
		markerValue,
		localValueIn,
		viewportHeight
	);

	while (position > 0 && position < viewportHeight) {
		markerValue += 100 *
			(1 + ((getHundredFromValue(markerValue) - markerValue) / 100));

		position = getViewportPositionFromValue(
			markerValue,
			localValueIn,
			viewportHeight
		);

		hundreds.push(markerValue);
	}

	return (
		<div className={styles.container}>
			<div className={styles.inner}>
				<div className={styles.currentValue} style={{
					top: `${viewportHeight/2}px`
				}}>
					<strong className={styles.holding}>
						▶ {formatLocalCurrency(localValueIn)}
					</strong>
					<span className={styles.price}>
						{formatCurrency(price)} per BTC
					</span>
				</div>
				{hundreds.map((value) => (
					<div
						className={styles.marker}
						key={value}
						style={{
							top: `${getViewportPositionFromValue(
								value,
								localValueIn,
								viewportHeight
							)}px`
						}}
					>
						<strong className={styles.holding}>
							{formatLocalCurrency(value)}
						</strong>
						<span className={styles.price}>
							{formatCurrency(value / localCurrencyRate / amountIn)} per BTC
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
