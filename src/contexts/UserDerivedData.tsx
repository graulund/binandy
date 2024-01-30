import React, { useContext } from "react";

import AppData from "./AppData";
import TickerData from "./TickerData";
import { localCurrencyRate } from "../constants";

type UserDerivedDataValue = {
	valueIn: number;
	localValueIn: number;
};

const UserDerivedDataContext = React.createContext<UserDerivedDataValue | null>(null);

export default function UserDerivedData({ children }: { children: React.ReactNode }) {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);

	let value = null;

	if (appData && tickerData) {
		const { amountIn } = appData;
		const { closePrice } = tickerData;

		value = {
			valueIn: amountIn * closePrice,
			localValueIn: amountIn * closePrice * localCurrencyRate
		};
	}

	return (
		<UserDerivedDataContext.Provider value={value}>
			{children}
		</UserDerivedDataContext.Provider>
	);
}

UserDerivedData.Context = UserDerivedDataContext;
