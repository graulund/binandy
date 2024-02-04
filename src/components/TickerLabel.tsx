import styles from "./TickerLabel.module.css";

type TickerLabelProps = {
	children: React.ReactNode;
};

export default function TickerLabel({ children }: TickerLabelProps) {
	return <div className={styles.label}>{children}</div>;
}
