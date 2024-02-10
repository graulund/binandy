import React, { useEffect, useMemo, useRef, useState } from "react";

import {
	TickerDataHandler,
	TickerEventData,
	createTickerWsConnection,
	fetchInitialTickerData
} from "../lib/tickerData";

type TickerContextData = {
	data: TickerEventData | null;
	error: string | null;
	loading: boolean;
	isUp: boolean;
	isDown: boolean;
};

const TickerDataContext = React.createContext<TickerContextData>({
	data: null,
	error: null,
	loading: true,
	isUp: false,
	isDown: false
});

export default function TickerData({ children }: { children: React.ReactNode }) {
	const [initialData, setInitialData] = useState<TickerEventData | null>(null);
	const [eventData, setEventData] = useState<TickerEventData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const prevPrice = useRef<number | null>(null);
	const ws = useRef<WebSocket | null>(null);

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
				setError(null);
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
		prevPrice.current = eventData?.closePrice
			?? initialData?.closePrice
			?? null;
	}, [eventData?.closePrice, initialData?.closePrice]);

	const contextData = useMemo(() => ({
		data: eventData || initialData,
		error,
		loading,
		isUp: eventData !== null &&
			prevPrice.current !== null &&
			eventData.closePrice > prevPrice.current,
		isDown: eventData !== null &&
			prevPrice.current !== null &&
			eventData.closePrice < prevPrice.current
	}), [error, eventData, initialData, loading]);

	return (
		<TickerDataContext.Provider value={contextData}>
			{children}
		</TickerDataContext.Provider>
	);
}

TickerData.Context = TickerDataContext;
