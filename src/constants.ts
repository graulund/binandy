export const productName = "Binandy";

export const tickerWsOrigin = "wss://stream.binance.com:9443";
export const tickerWsUrl = `${tickerWsOrigin}/ws/btcusdt@miniTicker`;
export const tickerRestOrigin = "https://api.binance.com";
export const tickerRestUrl = `${tickerRestOrigin}/api/v3/ticker?symbol=BTCUSDT`;

export const localCurrencyLocale = "da-DK";
export const localCurrencyName = "DKK";
export const localCurrencyRate = 6.9112;

export const transactionFeeLevels = [
	0.00075,
	0.001
];
