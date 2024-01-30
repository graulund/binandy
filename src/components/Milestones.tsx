import { useContext } from "react";
import clsx from "clsx";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import UserDerivedData from "../contexts/UserDerivedData";
import { formatCurrency, formatLocalCurrency } from "../lib/currencies";
import { localCurrencyRate } from "../constants";

import styles from "./Milestones.module.css";

export default function Milestones() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);
	const userDerivedData = useContext(UserDerivedData.Context);

	const { amountIn = 0 } = appData || {};
	const { localValueIn = 0 } = userDerivedData || {};
	const price = tickerData?.closePrice;

	if (!price || !appData || !userDerivedData || amountIn <= 0) {
		return null;
	}

	// One value for each thousand DKK around the current price, 1 lower, 4 higher

	const currentThousand = Math.floor(localValueIn / 1000) * 1000;

	const localMilestoneValues = [
		currentThousand,
		currentThousand + 1000,
		currentThousand + 2000,
		currentThousand + 3000,
		currentThousand + 4000
	];

	return (
		<div className={styles.wrapper}>
			<div className={styles.label}>
				Nearby milestones:
			</div>
			<div className={styles.milestones}>
				{localMilestoneValues.map((value) => {
					const goalPrice = value / localCurrencyRate / amountIn;
					const difference = price - goalPrice;

					const differenceClassName = clsx(styles.difference, {
						[styles.differenceAbove]: difference > 0,
						[styles.differenceBelow]: difference < 0
					});

					return (
						<div className={styles.milestone} key={value}>
							<div className={styles.label}>
								{formatLocalCurrency(value)} at:
							</div>
							<div className={styles.value}>
								{formatCurrency(goalPrice)}
							</div>
							<div className={differenceClassName}>
								(
									{difference >= 0 ? "+" : undefined}
									{formatCurrency(difference)}
								)
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}