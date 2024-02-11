import clsx from "clsx";

import useSubtle from "../hooks/useSubtle";

import styles from "./TickerLabel.module.css";

type TickerLabelProps = {
	children: React.ReactNode;
	size?: "normal" | "small";
};

export default function TickerLabel({ children, size }: TickerLabelProps) {
	const subtle = useSubtle();

	const className = clsx(styles.label, {
		[styles.smallLabel]: size === "small",
		[styles.subtleLabel]: subtle
	});

	return <div className={className}>{children}</div>;
}
