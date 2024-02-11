import React, { useCallback, useContext } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValue from "./TickerValue";
import TickerValueInput from "./TickerValueInput";

export default function Gains() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);

	const { config, derived, setAppConfig } = appData;
	const { amountIn = 0, originalPrice = null } = config || {};
	const price = tickerData.data?.closePrice;

	const handleNewOriginalPrice = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		const newOriginalPrice = Number(evt.target.value);

		if (typeof setAppConfig === "function") {
			setAppConfig({ originalPrice: newOriginalPrice });
		}
	}, [setAppConfig]);

	if (!price || !appData || !derived || !amountIn) {
		return null;
	}

	const {
		gains = null,
		localExitGains = null,
		localGains = null
	} = derived;

	return (
		<div>
			<TickerLabel>
				<label htmlFor="original-price-input">
					Your starting BTC/USDT price:
				</label>
			</TickerLabel>
			<TickerValueInput
				id="original-price-input"
				value={originalPrice || 0}
				onChange={handleNewOriginalPrice}
			/>
			{
				gains !== null &&
				localExitGains !== null &&
				localGains !== null && (
					<>
						<TickerLabel>
							Your gains:
						</TickerLabel>
						<TickerValue
							isDifference
							value={gains}
						/>
						<TickerLabel>
							Which is:
						</TickerLabel>
						<TickerValue
							isDifference
							isLocalValue
							value={localGains}
						/>
						{localExitGains.map(({ feeLevel, gainsPostFee }) => (
							<React.Fragment key={feeLevel}>
								<TickerLabel size="small">
									If you exited now, you would get (after {feeLevel * 100}% fee):
								</TickerLabel>
								<TickerValue
									isDifference
									isLocalValue
									size="small"
									value={gainsPostFee}
								/>
							</React.Fragment>
						))}
					</>
				)
			}
		</div>
	);
}
