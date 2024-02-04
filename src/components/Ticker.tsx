import { useCallback, useContext, useEffect } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValue from "./TickerValue";
import TickerValueInput from "./TickerValueInput";
import UserDerivedData from "../contexts/UserDerivedData";
import { formatLocalCurrency } from "../lib/currencies";
import setDocTitle from "../lib/docTitle";

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
			? formatLocalCurrency(localValueIn)
			: ""
	), [price, localValueIn]);

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
			{amountIn > 0 && (
				<>
					<TickerLabel>
						Your holdings:
					</TickerLabel>
					<TickerValue value={valueIn} />
					<TickerLabel>
						Which is:
					</TickerLabel>
					<TickerValue isLocalValue value={localValueIn} />
				</>
			)}
		</div>
	);
}
