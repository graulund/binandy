import { useContext } from "react";

import AppData from "../contexts/AppData";
import { formatCurrency, formatLocalCurrency } from "../lib/formatNumbers";

import styles from "./CurrencyRateDisplay.module.css";

export default function CurrencyRateDisplay() {
	const appData = useContext(AppData.Context);
	const { localCurrencyRate } = appData;

	return (
		<div className={styles.container}>
			<div className={styles.primary}>
				{formatCurrency(1)} = {formatLocalCurrency(localCurrencyRate.rate)}
			</div>
			{localCurrencyRate.updated && (
				<div className={styles.secondary}>
					(Currency rate updated {localCurrencyRate.updated.toLocaleString("en-GB")})
				</div>
			)}
		</div>
	)
}
