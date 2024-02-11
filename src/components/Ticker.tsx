import { useCallback, useContext } from "react";

import AppData from "../contexts/AppData";
import AppStatus from "./AppStatus";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValue from "./TickerValue";
import TickerValueInput from "./TickerValueInput";

export default function Ticker() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);

	const { error, loading } = tickerData;
	const { config, derived, setAppConfig } = appData;
	const { amountIn = 0, amountToSpend = 0 } = config || {};
	const { holdings = 0, localHoldings = 0, maxBuy = 0 } = derived || {};
	const price = tickerData.data?.closePrice;

	const handleNewAmountIn = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountIn = Number(evt.target.value);

		if (typeof setAppConfig === "function") {
			setAppConfig({ amountIn: newAmountIn });
		}
	}, [setAppConfig]);

	const handleNewAmountToSpend = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newAmountToSpend = Number(evt.target.value);

		if (typeof setAppConfig === "function") {
			setAppConfig({ amountToSpend: newAmountToSpend });
		}
	}, [setAppConfig]);

	if (error || loading) {
		return <AppStatus error={error} loading={loading} />;
	}

	if (!price || !appData) {
		return <AppStatus error="No data" />;
	}

	return (
		<div>
			<TickerLabel>
				Current BTC/USDT price:
			</TickerLabel>
			<TickerValue
				withSymbol
				value={price}
				isUp={tickerData?.direction?.isUp}
				isDown={tickerData?.direction?.isDown}
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
					<TickerValue value={holdings} />
					<TickerLabel>
						Which is:
					</TickerLabel>
					<TickerValue isLocalValue value={localHoldings} />
				</>
			)}
			{maxBuy > 0 && (
				<>
					<TickerLabel>
						You would be able to buy this amount of BTC:
					</TickerLabel>
					<TickerValue size="small" isCryptoValue value={maxBuy} />
				</>
			)}
		</div>
	);
}
