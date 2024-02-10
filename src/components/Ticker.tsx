import { useCallback, useContext, useEffect, useState } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValue from "./TickerValue";
import TickerValueInput from "./TickerValueInput";
import UserDerivedData from "../contexts/UserDerivedData";
import { formatLocalCurrency } from "../lib/currencies";
import setDocTitle from "../lib/docTitle";
import { localCurrencyRate } from "../constants";

export default function Ticker() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);
	const userDerivedData = useContext(UserDerivedData.Context);

	const { error, loading } = tickerData;
	const { amountIn = 0, amountToSpend = 0, setAppData } = appData || {};
	const { valueIn = 0, localValueIn = 0 } = userDerivedData || {};
	const price = tickerData.data?.closePrice;

	const handleNewAmountIn = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountIn = Number(evt.target.value);

		if (typeof setAppData === "function") {
			setAppData({ amountIn: newAmountIn });
		}
	}, [setAppData]);

	const handleNewAmountToSpend = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountToSpend = Number(evt.target.value);

		if (typeof setAppData === "function") {
			setAppData({ amountToSpend: newAmountToSpend });
		}
	}, [setAppData]);

	useEffect(() => setDocTitle(
		price && localValueIn && localValueIn > 0
			? formatLocalCurrency(localValueIn)
			: ""
	), [price, localValueIn]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!price || !appData || !userDerivedData) {
		return null;
	}
	return (
		<div>
			<TickerLabel>
				Current BTC/USDT price:
			</TickerLabel>
			<TickerValue
				withSymbol
				value={price}
				isUp={tickerData?.isUp}
				isDown={tickerData?.isDown}
			/>
			<TickerLabel>
				<label htmlFor="amount-in-input">
					Your BTC amount in:
				</label>
			</TickerLabel>
			<TickerValueInput
				id="amount-in-input"
				value={amountIn}
				onChange={handleNewAmountIn}
			/>
			<TickerLabel>
				<label htmlFor="usdt-amount">
					Your USDT to spend:
				</label>
			</TickerLabel>
			<TickerValueInput
				id="usdt-amount"
				value={amountToSpend}
				onChange={handleNewAmountToSpend}
			/>
			{amountIn > 0 && (
				<>
					<TickerLabel>
						Your holdings:
					</TickerLabel>
					<TickerValue value={valueIn + amountToSpend} />
					<TickerLabel>
						Which is:
					</TickerLabel>
					{/* TODO: Move this calculation to a context */}
					<TickerValue isLocalValue value={localValueIn + localCurrencyRate * amountToSpend} />
				</>
			)}
			{amountToSpend > 0 && (
				<>
					<TickerLabel>
						You would be able to buy this amount of BTC:
					</TickerLabel>
					{amountToSpend / price}
				</>
			)}
		</div>
	);
}
