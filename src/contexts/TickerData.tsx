import React, { useEffect, useMemo, useRef, useState } from "react";

import {
	TickerDataHandler,
	TickerDirectionInfo,
	TickerEventData,
	createTickerWsConnection,
	fetchInitialTickerData,
	getTickerDirectionInfo
} from "../lib/tickerData";

type TickerContextData = {
	data: TickerEventData | null;
	error: string | undefined;
	loading: boolean;
	direction: TickerDirectionInfo | null;
};

const TickerDataContext = React.createContext<TickerContextData>({
	data: null,
	error: undefined,
	loading: true,
	direction: null
});

export default function TickerData({ children }: { children: React.ReactNode }) {
	/** Data from page load */
	const [initialData, setInitialData] = useState<TickerEventData | null>(null);
	/** Real time data from sockets connction */
	const [eventData, setEventData] = useState<TickerEventData | null>(null);
	const ws = useRef<WebSocket | null>(null);

	const [error, setError] = useState<string | undefined>();
	const [loading, setLoading] = useState(true);
	const prevPrice = useRef<number | undefined>();

	useEffect(() => {
		(async function () {
			const data = await fetchInitialTickerData();

			if (data) {
				setInitialData(data);
				setLoading(false);
			}
		})();

		const onData: TickerDataHandler = (result) => {
			if (result.success) {
				setEventData(result.data);
				setError(undefined);
			} else {
				setError("Invalid ticker data received");
			}

			setLoading(false);
		};

		if (!ws.current) {
			createTickerWsConnection(ws, onData);
		}

		return () => {
			if (ws.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				ws.current.close();
			}
		};
	}, []);

	useEffect(() => {
		prevPrice.current = eventData?.closePrice ?? initialData?.closePrice;
	}, [eventData?.closePrice, initialData?.closePrice]);

	const contextData = useMemo(() => ({
		data: eventData || initialData,
		error,
		loading,
		direction: getTickerDirectionInfo(
			eventData?.closePrice,
			prevPrice.current
		)
	}), [error, eventData, initialData, loading]);

	return (
		<TickerDataContext.Provider value={contextData}>
			{children}
		</TickerDataContext.Provider>
	);
}

TickerData.Context = TickerDataContext;
