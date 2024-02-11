import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";

import TickerData from "./TickerData";

import {
	AppConfig,
	defaultAppConfig,
	getConfigFromStorage,
	saveConfigToStorage
} from "../lib/appConfig";

import fetchLocalCurrencyRate, { CurrencyRateInfo } from "../lib/currencyRate";
import getDerivedData, { DerivedValues } from "../lib/derivedData";
import { localCurrencyRate as defaultLocalCurrencyRate } from "../constants";

type AppContextData = {
	config: AppConfig | null;
	derived: DerivedValues | null;
	localCurrencyRate: CurrencyRateInfo;
};

type AppContextValue = AppContextData & {
	setAppConfig: (newValues: Partial<AppConfig>) => void;
};

const AppDataContext = React.createContext<AppContextValue>({} as AppContextValue);

export default function AppData({ children }: { children: React.ReactNode }) {
	const tickerData = useContext(TickerData.Context);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [config, setConfig] = useState<AppConfig | null>(null);
	const [localCurrencyRate, setLocalCurrencyRate] = useState<CurrencyRateInfo>({
		rate: defaultLocalCurrencyRate,
		updated: null
	});

	useEffect(() => {
		(async function() {
			const fetchedValues = await fetchLocalCurrencyRate();

			if (fetchedValues) {
				setLocalCurrencyRate(fetchedValues);
			}
		})();

		const config = getConfigFromStorage();
		setConfig({ ...defaultAppConfig, ...(config || {}) });
		setDataLoaded(true);
	}, []);

	useEffect(() => {
		if (!dataLoaded) {
			return;
		}

		saveConfigToStorage(config);
	}, [config, dataLoaded]);

	const setAppConfig = useCallback((newConfigValues: Partial<AppConfig>) => {
		setConfig((prevConfig) => ({
			...(prevConfig || defaultAppConfig),
			...newConfigValues
		}));
	}, []);

	const contextValue = useMemo(() => ({
		config,
		derived: getDerivedData(localCurrencyRate.rate, config, tickerData.data),
		localCurrencyRate,
		setAppConfig
	}), [config, localCurrencyRate, setAppConfig, tickerData.data]);

	return (
		<AppDataContext.Provider value={contextValue}>
			{children}
		</AppDataContext.Provider>
	);
}

AppData.Context = AppDataContext;
