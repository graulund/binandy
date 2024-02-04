import React, { useContext } from "react";

import AppData from "./AppData";
import TickerData from "./TickerData";
import { localCurrencyRate } from "../constants";

type UserDerivedDataValue = {
	localValueIn: number;
	originalLocalValueIn: number | null;
	originalValueIn: number | null;
	valueIn: number;
};

const UserDerivedDataContext = React.createContext<UserDerivedDataValue | null>(null);

export default function UserDerivedData({ children }: { children: React.ReactNode }) {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);

	let value: UserDerivedDataValue | null = null;

	if (appData && tickerData) {
		const { amountIn, originalPrice } = appData;
		const { closePrice } = tickerData;

		value = {
			localValueIn: amountIn * closePrice * localCurrencyRate,
			originalLocalValueIn: null,
			originalValueIn: null,
			valueIn: amountIn * closePrice,
		};

		if (originalPrice && originalPrice > 0) {
			value.originalValueIn = originalPrice * amountIn;
			value.originalLocalValueIn = originalPrice * amountIn * localCurrencyRate;
		}
	}

	return (
		<UserDerivedDataContext.Provider value={value}>
			{children}
		</UserDerivedDataContext.Provider>
	);
}

UserDerivedData.Context = UserDerivedDataContext;
