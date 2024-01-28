import Ticker from "./components/Ticker";
import TickerData from "./contexts/TickerData";

import styles from "./App.module.css";

export default function App() {
	return (
		<div className={styles.app}>
			<TickerData>
				<Ticker />
			</TickerData>
		</div>
	);
}
