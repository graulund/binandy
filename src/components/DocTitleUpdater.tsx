import { useContext, useEffect } from "react";

import AppData from "../contexts/AppData";
import setDocTitle from "../lib/docTitle";
import { formatCryptoAmount, formatLocalCurrency } from "../lib/formatNumbers";

export default function DocTitleUpdater() {
	const appData = useContext(AppData.Context);
	const { derived } = appData;
	const { localHoldings, localValueIn, maxBuy } = derived || {};

	useEffect(() => {
		if (localValueIn && localHoldings) {
			setDocTitle(formatLocalCurrency(localHoldings));
		} else if (maxBuy) {
			setDocTitle(`${formatCryptoAmount(maxBuy)} max buy`);
		} else {
			setDocTitle();
		}
	}, [localHoldings, localValueIn, maxBuy]);

	return null;
}
