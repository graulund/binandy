import { useCallback, useContext, useState } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValueInput from "./TickerValueInput";
import TickerValue from "./TickerValue";
import { localCurrencyCode } from "../constants";

export default function Calculator() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);
	const [desiredAmount, setDesiredAmount] = useState(0);
	const [desiredHoldings, setDesiredHoldings] = useState(0);
	const [hypotheticalAmount, setHypotheticalAmount] = useState(0);
	const [hypotheticalPrice, setHypotheticalPrice] = useState(0);

	const { config, derived } = appData;
	const { amountIn = 0, amountToSpend = 0 } = config || {};
	const price = tickerData.data?.closePrice;

	const handleNewDesiredHoldings = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setDesiredHoldings(Number(evt.target.value));
		},
		[setDesiredHoldings]
	);

	const handleNewDesiredAmount = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setDesiredAmount(Number(evt.target.value));
		},
		[setDesiredAmount]
	);

	const handleNewHypotheticalAmount = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setHypotheticalAmount(Number(evt.target.value));
		},
		[setHypotheticalAmount]
	);

	const handleNewHypotheticalPrice = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setHypotheticalPrice(Number(evt.target.value));
		},
		[setHypotheticalPrice]
	);

	if (
		!price ||
		!appData ||
		!derived ||
		(amountIn <= 0 && amountToSpend <= 0)
	) {
		return null;
	}

	const {
		getHoldingsAtHypotheticalPrice,
		getHypotheticalHoldings,
		getHypotheticalLocalHoldings,
		getLocalHoldingsAtHypotheticalPrice,
		getRequiredPriceForDesiredAmount,
		getRequiredPriceForDesiredLocalHoldings,
		holdings,
		localHoldings
	} = derived;

	const amountGoalPrice = desiredAmount > 0
		? getRequiredPriceForDesiredAmount(desiredAmount)
		: 0;

	const holdingsGoalPrice = desiredHoldings > 0
		? getRequiredPriceForDesiredLocalHoldings(desiredHoldings)
		: 0;

	const localHoldingsWithHypotheticalAmount = hypotheticalAmount > 0
		? getHypotheticalLocalHoldings(hypotheticalAmount)
		: 0;

	const holdingsWithHypotheticalAmount = hypotheticalAmount > 0
		? getHypotheticalHoldings(hypotheticalAmount)
		: 0;

	const localHoldingsAtHypotheticalPrice = hypotheticalPrice > 0
		? getLocalHoldingsAtHypotheticalPrice(hypotheticalPrice)
		: 0;

	const holdingsAtHypotheticalPrice = hypotheticalPrice > 0
		? getHoldingsAtHypotheticalPrice(hypotheticalPrice)
		: 0;

	return (
		<div>
			{amountIn > 0 && (
				<div>
					<TickerLabel size="small">
						<label htmlFor="calc-local-value-in">
							Calculate required BTC price for desired holdings ({localCurrencyCode}):
						</label>
					</TickerLabel>
					<TickerValueInput
						id="calc-local-value-in"
						onChange={handleNewDesiredHoldings}
						placeholder={localCurrencyCode}
						value={desiredHoldings || ""}
					/>
					{holdingsGoalPrice > 0 && (
						<>
							<TickerValue size="small" value={holdingsGoalPrice} />
							<TickerValue
								isDifference
								size="small"
								value={price - holdingsGoalPrice}
								withParens
							/>
						</>
					)}
				</div>
			)}
			{amountToSpend > 0 && (
				<div>
					<TickerLabel size="small">
						<label htmlFor="calc-amount-in">
							Calculate required BTC price for desired amount:
						</label>
					</TickerLabel>
					<TickerValueInput
						id="calc-amount-in"
						onChange={handleNewDesiredAmount}
						placeholder="BTC"
						value={desiredAmount || ""}
					/>
					{amountGoalPrice > 0 && (
						<>
							<TickerValue size="small" value={amountGoalPrice} />
							<TickerValue
								isDifference
								size="small"
								value={price - amountGoalPrice}
								withParens
							/>
						</>
					)}
				</div>

			)}
			{amountIn > 0 && (
				<>
					<div>
						<TickerLabel size="small">
							<label htmlFor="calc-hypothetical-amount-in">
								Calculate holdings for hypothetical BTC amount:
							</label>
						</TickerLabel>
						<TickerValueInput
							id="calc-hypothetical-amount-in"
							onChange={handleNewHypotheticalAmount}
							placeholder="BTC"
							value={hypotheticalAmount || ""}
						/>
						{localHoldingsWithHypotheticalAmount > 0 && holdingsWithHypotheticalAmount > 0 && (
							<>
								<TickerValue
									size="small"
									value={holdingsWithHypotheticalAmount}
								/>
								<TickerValue
									isLocalValue
									size="small"
									value={localHoldingsWithHypotheticalAmount}
								/>
								<TickerValue
									isDifference
									size="small"
									value={holdings - holdingsWithHypotheticalAmount}
									withParens
								/>
								<TickerValue
									isDifference
									isLocalValue
									size="small"
									value={localHoldings - localHoldingsWithHypotheticalAmount}
									withParens
								/>
							</>
						)}
					</div>
					<div>
						<TickerLabel size="small">
							<label htmlFor="calc-hypothetical-price">
								Calculate holdings for hypothetical BTC price:
							</label>
						</TickerLabel>
						<TickerValueInput
							id="calc-hypothetical-price"
							onChange={handleNewHypotheticalPrice}
							placeholder="$"
							value={hypotheticalPrice || ""}
						/>
						{localHoldingsAtHypotheticalPrice > 0 && holdingsAtHypotheticalPrice > 0 && (
							<>
								<TickerValue
									size="small"
									value={holdingsAtHypotheticalPrice}
								/>
								<TickerValue
									isLocalValue
									size="small"
									value={localHoldingsAtHypotheticalPrice}
								/>
								<TickerValue
									isDifference
									size="small"
									value={holdings - holdingsAtHypotheticalPrice}
									withParens
								/>
								<TickerValue
									isDifference
									isLocalValue
									size="small"
									value={localHoldings - localHoldingsAtHypotheticalPrice}
									withParens
								/>
							</>
						)}
					</div>
				</>
			)}
		</div>
	)
}
