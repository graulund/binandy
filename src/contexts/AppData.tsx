import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import TickerData from "./TickerData";

import {
	AppConfig,
	defaultAppConfig,
	getConfigFromStorage,
	saveConfigToStorage
} from "../lib/appConfig";

import getDerivedData, { DerivedValues } from "../lib/derivedData";

type AppContextData = {
	config: AppConfig | null;
	derived: DerivedValues | null;
};

type AppContextValue = AppContextData & {
	setAppConfig: (newValues: Partial<AppConfig>) => void;
};

const AppDataContext = React.createContext<AppContextValue>({} as AppContextValue);

export default function AppData({ children }: { children: React.ReactNode }) {
	const tickerData = useContext(TickerData.Context);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [config, setConfig] = useState<AppConfig | null>(null);

	useEffect(() => {
		const config = getConfigFromStorage();
		setConfig(config);
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
		derived: getDerivedData(config, tickerData.data),
		setAppConfig
	}), [config, setAppConfig, tickerData.data]);

	return (
		<AppDataContext.Provider value={contextValue}>
			{children}
		</AppDataContext.Provider>
	);
}

AppData.Context = AppDataContext;
