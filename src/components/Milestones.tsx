import { useContext } from "react";
import clsx from "clsx";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import UserDerivedData from "../contexts/UserDerivedData";
import { localCurrencyRate } from "../constants";

import styles from "./Milestones.module.css";

const localCurrencyFormatter = new Intl.NumberFormat(
	"da-DK", { style: "currency", currency: "DKK" }
);

const currencyFormatter = new Intl.NumberFormat(
	"en-US", { style: "currency", currency: "USD" }
);

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
	const localMilestoneValues = [
		Math.floor(localValueIn / 1000) * 1000,
		Math.floor(localValueIn / 1000) * 1000 + 1000,
		Math.floor(localValueIn / 1000) * 1000 + 2000,
		Math.floor(localValueIn / 1000) * 1000 + 3000,
		Math.floor(localValueIn / 1000) * 1000 + 4000,
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
								{localCurrencyFormatter.format(value)} at:
							</div>
							<div className={styles.value}>
								{currencyFormatter.format(goalPrice)}
							</div>
							<div className={differenceClassName}>
								(
									{difference >= 0 ? "+" : undefined}
									{currencyFormatter.format(difference)}
								)
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
