import { useContext } from "react";

import AppData from "../contexts/AppData";

export default function useSubtle() {
	const appData = useContext(AppData.Context);
	const { config } = appData;
	return config?.subtle || false;
}
