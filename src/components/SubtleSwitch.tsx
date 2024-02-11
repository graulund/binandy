import { useCallback, useContext } from "react";

import AppData from "../contexts/AppData";

import styles from "./SubtleSwitch.module.css";
import clsx from "clsx";

export default function SubtleSwitch() {
	const appData = useContext(AppData.Context);
	const { config, setAppConfig } = appData;
	const { subtle = false } = config || {};

	const handleSubtleToggle = useCallback(() => {
		if (typeof setAppConfig === "function") {
			setAppConfig({ subtle: !subtle });
		}
	}, [setAppConfig, subtle]);

	const className = clsx(styles.switch, {
		[styles.switchOn]: subtle
	});

	return (
		<button
			className={className}
			onClick={handleSubtleToggle}
			title={`Turn subtle mode ${subtle ? "off" : "on"}`}
		>
			Subtle
		</button>
	);
}
