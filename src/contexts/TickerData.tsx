import React, { useEffect, useMemo, useRef, useState } from "react";
import { tickerWsOrigin, tickerWsUrl } from "../constants";

const tickerEventType = "24hrMiniTicker";

/*
	{
		"e": "24hrMiniTicker", // Event type
		"E": 1672515782136,    // Event time
		"s": "BNBBTC",         // Symbol
		"c": "0.0025",         // Close price
		"o": "0.0010",         // Open price
		"h": "0.0025",         // High price
		"l": "0.0010",         // Low price
		"v": "10000",          // Total traded base asset volume
		"q": "18"              // Total traded quote asset volume
	}
*/

type TickerEventPayload = {
	updated: Date;
	symbol: string;
	closePrice: number;
	openPrice: number;
	highPrice: number;
	lowPrice: number;
	totalTradedBaseAssetVolume: number;
	totalTradedQuoteAssetVolume: number;
};

type TickerContextData = TickerEventPayload & {
	isUp: boolean;
	isDown: boolean;
};

const TickerDataContext = React.createContext<TickerContextData | null>(null);

export default function TickerData({ children }: { children: React.ReactNode }) {
	const [eventData, setEventData] = useState<TickerEventPayload | null>(null);
	const prevPrice = useRef<number | null>(null);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(tickerWsUrl);

		ws.current.addEventListener("open", () => {
			console.log("Connected to WS");
		});

		ws.current.addEventListener("error", (err) => {
			console.error(err);
		});

		ws.current.addEventListener("message", (evt) => {
			if (evt?.origin !== tickerWsOrigin) {
				return;
			}

			try {
				const data = JSON.parse(evt.data);

				if (
					data &&
					data.e === tickerEventType &&
					typeof data.E === "number" &&
					typeof data.s === "string" &&
					typeof data.c === "string" &&
					typeof data.o === "string" &&
					typeof data.h === "string" &&
					typeof data.l === "string" &&
					typeof data.v === "string" &&
					typeof data.q === "string"
				) {
					setEventData({
						updated: new Date(data.E),
						symbol: data.s,
						closePrice: parseFloat(data.c),
						openPrice: parseFloat(data.o),
						highPrice: parseFloat(data.h),
						lowPrice: parseFloat(data.l),
						totalTradedBaseAssetVolume: parseFloat(data.v),
						totalTradedQuoteAssetVolume: parseFloat(data.q)
					});
				}
			} catch (e) {
				console.error(e);
			}
		});

		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, []);

	useEffect(() => {
		prevPrice.current = eventData?.closePrice ?? null;
	}, [eventData]);

	const contextData = useMemo(() => {
		if (!eventData) {
			return null;
		}

		return {
			...eventData,
			isUp: prevPrice.current !== null && eventData.closePrice > prevPrice.current,
			isDown: prevPrice.current !== null && eventData.closePrice < prevPrice.current
		};
	}, [eventData]);

	return (
		<TickerDataContext.Provider value={contextData}>
			{children}
		</TickerDataContext.Provider>
	);
}

TickerData.Context = TickerDataContext;
