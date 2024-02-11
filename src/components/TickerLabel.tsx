import clsx from "clsx";

import styles from "./TickerLabel.module.css";

type TickerLabelProps = {
	children: React.ReactNode;
	size?: "normal" | "small";
};

export default function TickerLabel({ children, size }: TickerLabelProps) {
	const className = clsx(styles.label, {
		[styles.smallLabel]: size === "small"
	});

	return <div className={className}>{children}</div>;
}
