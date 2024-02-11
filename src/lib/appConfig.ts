const appConfigStorageName = "binandy.config";

export type AppConfig = {
	amountIn: number;
	amountToSpend: number;
	originalPrice: number | null;
	subtle: boolean;
};

export const defaultAppConfig = {
	amountIn: 0,
	amountToSpend: 0,
	originalPrice: null,
	subtle: false
};

export function getConfigFromStorage(): Partial<AppConfig> | null {
	try {
		const storedData = localStorage.getItem(appConfigStorageName);

		if (storedData) {
			return JSON.parse(storedData);
		}
	} catch (e) {
		console.error("Error loading app config", e);
	}

	return null;
}

export function saveConfigToStorage(config: AppConfig | null) {
	if (!config) {
		localStorage.removeItem(appConfigStorageName);
		return;
	}

	try {
		localStorage.setItem(appConfigStorageName, JSON.stringify(config));
	} catch (e) {
		console.error("Error saving app config", e);
	}
}
