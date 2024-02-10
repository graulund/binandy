import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { tickerWsOrigin, tickerWsUrl } from "../constants";

const tickerEventType = "24hrMiniTicker";
const numericRegex = /^-?\d+(\.\d+)?$/;

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

const TickerEventPayloadScheme = z.object({
	e: z.literal(tickerEventType),
	E: z.number(),
	s: z.string(),
	c: z.string().regex(numericRegex),
	o: z.string().regex(numericRegex),
	h: z.string().regex(numericRegex),
	l: z.string().regex(numericRegex),
	v: z.string().regex(numericRegex),
	q: z.string().regex(numericRegex)
});

type TickerEventData = {
	updated: Date;
	symbol: string;
	closePrice: number;
	openPrice: number;
	highPrice: number;
	lowPrice: number;
	totalTradedBaseAssetVolume: number;
	totalTradedQuoteAssetVolume: number;
};

type TickerContextData = TickerEventData & {
	isUp: boolean;
	isDown: boolean;
};

const TickerDataContext = React.createContext<TickerContextData | null>(null);

export default function TickerData({ children }: { children: React.ReactNode }) {
	const [eventData, setEventData] = useState<TickerEventData | null>(null);
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
				const rawPayload = JSON.parse(evt.data);
				const payload = TickerEventPayloadScheme.parse(rawPayload);

				setEventData({
					updated: new Date(payload.E),
					symbol: payload.s,
					closePrice: parseFloat(payload.c),
					openPrice: parseFloat(payload.o),
					highPrice: parseFloat(payload.h),
					lowPrice: parseFloat(payload.l),
					totalTradedBaseAssetVolume: parseFloat(payload.v),
					totalTradedQuoteAssetVolume: parseFloat(payload.q)
				});
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
