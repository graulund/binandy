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

let wsReconnectTimeoutMs = 125;

function createWsConnection(
	wsRef: React.MutableRefObject<WebSocket | null>,
	onMessage: (evt: MessageEvent) => void
) {
	console.log("Creating WS connection...");
	wsRef.current = new WebSocket(tickerWsUrl);

	wsRef.current.addEventListener("open", () => {
		console.log("Connected to WS");
	});

	wsRef.current.addEventListener("error", (err) => {
		console.error(err);
		wsRef.current?.close();
	});

	wsRef.current.addEventListener("close", () => {
		console.log("WS connection closed, trying to reconnect...");

		setTimeout(() => {
			wsRef.current = null;
			createWsConnection(wsRef, onMessage);
		}, Math.min(10000, wsReconnectTimeoutMs *= 2));
	});

	wsRef.current.addEventListener("message", onMessage);
}

const TickerDataContext = React.createContext<TickerContextData | null>(null);

export default function TickerData({ children }: { children: React.ReactNode }) {
	const [eventData, setEventData] = useState<TickerEventData | null>(null);
	const prevPrice = useRef<number | null>(null);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		const onMessage = (evt: MessageEvent) => {
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
		};

		if (!ws.current) {
			createWsConnection(ws, onMessage);
		}

		return () => {
			if (ws.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
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
