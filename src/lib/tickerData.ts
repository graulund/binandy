import { z } from "zod";

import { tickerRestUrl, tickerWsOrigin, tickerWsUrl } from "../constants";

export type TickerEventData = {
	updated: Date;
	symbol: string;
	closePrice: number;
	openPrice: number;
	highPrice: number;
	lowPrice: number;
	totalTradedBaseAssetVolume: number;
	totalTradedQuoteAssetVolume: number;
};

export type TickerDataHandler =
	(result: { success: true, data: TickerEventData } | { success: false }) => void;

export type TickerDirectionInfo = {
	isUp: boolean;
	isDown: boolean;
};

const tickerEventType = "24hrMiniTicker";
const numericRegex = /^-?\d+(\.\d+)?$/;

/*
	Ticker event payload example:
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

/*
	Ticker rest payload example:
	{
		"symbol": "BTCUSDT",
		"priceChange": "398.01000000",
		"priceChangePercent": "0.837",
		"weightedAvgPrice": "47330.29001768",
		"openPrice": "47573.27000000",
		"highPrice": "48170.00000000",
		"lowPrice": "46800.00000000",
		"lastPrice": "47971.28000000",
		"volume": "24911.33597000",
		"quoteVolume": "1179060756.18788140",
		"openTime": 1707512520000,
		"closeTime": 1707598978392,
		"firstId": 3409200041,
		"lastId": 3410475028,
		"count": 1274988
	}
*/

const TickerRestPayloadScheme = z.object({
	symbol: z.string(),
	openPrice: z.string().regex(numericRegex),
	highPrice: z.string().regex(numericRegex),
	lowPrice: z.string().regex(numericRegex),
	lastPrice: z.string().regex(numericRegex),
	volume: z.string().regex(numericRegex),
	quoteVolume: z.string().regex(numericRegex),
	closeTime: z.number()
});

let wsReconnectTimeoutMs = 125;

export function createTickerWsConnection(
	wsRef: React.MutableRefObject<WebSocket | null>,
	onData: TickerDataHandler
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
			createTickerWsConnection(wsRef, onData);
		}, Math.min(10000, wsReconnectTimeoutMs *= 2));
	});

	wsRef.current.addEventListener("message", (evt) => {
		if (evt?.origin !== tickerWsOrigin) {
			return;
		}

		try {
			const rawPayload = JSON.parse(evt.data);
			const result = TickerEventPayloadScheme.safeParse(rawPayload);

			if (result.success) {
				const payload = result.data;

				onData({ success: true, data: {
					updated: new Date(payload.E),
					symbol: payload.s,
					closePrice: parseFloat(payload.c),
					openPrice: parseFloat(payload.o),
					highPrice: parseFloat(payload.h),
					lowPrice: parseFloat(payload.l),
					totalTradedBaseAssetVolume: parseFloat(payload.v),
					totalTradedQuoteAssetVolume: parseFloat(payload.q)
				}});
			} else {
				onData({ success: false });
			}
		} catch (e) {
			console.error("Invalid payload", e);
			onData({ success: false });
		}
	});
}

export async function fetchInitialTickerData() {
	try {
		const resource = await fetch(tickerRestUrl);
		const rawPayload = await resource.json();
		const payload = TickerRestPayloadScheme.parse(rawPayload);

		return {
			updated: new Date(payload.closeTime),
			symbol: payload.symbol,
			closePrice: parseFloat(payload.lastPrice),
			openPrice: parseFloat(payload.openPrice),
			highPrice: parseFloat(payload.highPrice),
			lowPrice: parseFloat(payload.lowPrice),
			totalTradedBaseAssetVolume: parseFloat(payload.volume),
			totalTradedQuoteAssetVolume: parseFloat(payload.quoteVolume)
		};
	} catch (e) {
		console.error("Failed to fetch initial ticker data", e);
	}

	return null;
}

export function getTickerDirectionInfo(
	currentPrice?: number,
	prevPrice?: number
): TickerDirectionInfo {
	if (typeof currentPrice !== "number" || typeof prevPrice !== "number") {
		// No comparison available
		return { isUp: false, isDown: false };
	}

	return {
		isUp: currentPrice > prevPrice,
		isDown: currentPrice < prevPrice
	};
}
