import { useCallback, useContext } from "react";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import TickerValue from "./TickerValue";
import TickerValueInput from "./TickerValueInput";

const feeRatio = 0.001;
const lowerFeeRatio = 0.00075;

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
		localValueIn = 0,
		originalLocalValueIn = null,
		originalValueIn = null,
		valueIn = 0,
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
				originalPrice &&
				originalPrice > 0 &&
				originalValueIn &&
				originalValueIn > 0 &&
				originalLocalValueIn &&
				originalLocalValueIn > 0 && (
					<>
						<TickerLabel>
							Your gains:
						</TickerLabel>
						<TickerValue
							isDifference
							value={valueIn - originalValueIn}
						/>
						<TickerLabel>
							Which is:
						</TickerLabel>
						<TickerValue
							isDifference
							isLocalValue
							value={localValueIn - originalLocalValueIn}
						/>
						<TickerLabel>
							If you exited now, you would get (after 0.75% fee):
						</TickerLabel>
						<TickerValue
							isDifference
							isLocalValue
							value={localValueIn - originalLocalValueIn - (localValueIn * lowerFeeRatio)}
						/>
						<TickerLabel>
							If you exited now, you would get (after 1% fee):
						</TickerLabel>
						<TickerValue
							isDifference
							isLocalValue
							value={localValueIn - originalLocalValueIn - (localValueIn * feeRatio)}
						/>
					</>
				)
			}
		</div>
	);
}
