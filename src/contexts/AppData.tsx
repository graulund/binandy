import React, { useCallback, useEffect, useMemo, useState } from "react";

const appDataStorageName = "binandy.state";

type AppContextData = {
	amountIn: number;
};

const defaultContextData: AppContextData = {
	amountIn: 0
};

type AppContextValue = AppContextData & {
	setAppData: (newValues: Partial<AppContextData>) => void;
};

const AppDataContext = React.createContext<AppContextValue | null>(null);

export default function AppData({ children }: { children: React.ReactNode }) {
	const [data, setData] = useState<AppContextData | null>(null);

	useEffect(() => {
		try {
			const storedData = localStorage.getItem(
				appDataStorageName
			);

			if (storedData) {
				setData(JSON.parse(storedData));
			}
		} catch (e) {
			console.error("Error loading app data", e);
			setData(null);
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(
				appDataStorageName,
				JSON.stringify(data || null)
			);
		} catch (e) {
			console.error("Error saving app data", e);
		}
	}, [data]);

	const setAppData = useCallback((newValues: Partial<AppContextData>) => {
		setData((prevData) => ({
			...defaultContextData,
			...prevData,
			...newValues
		}));
	}, []);

	const contextValue = useMemo(() => ({
		...(data || defaultContextData),
		setAppData
	}), [data, setAppData]);

	return (
		<AppDataContext.Provider value={contextValue}>
			{children}
		</AppDataContext.Provider>
	);
}

AppData.Context = AppDataContext;
