import AppData from "./contexts/AppData";
import Gains from "./components/Gains";
import Milestones from "./components/Milestones";
import MoneyThermometer from "./components/MoneyThermometer";
import Ticker from "./components/Ticker";
import TickerData from "./contexts/TickerData";

import styles from "./App.module.css";

export default function App() {
	return (
		<div className={styles.app}>
			<TickerData>
				<AppData>
					<Ticker />
					<Gains />
					<Milestones />
					<MoneyThermometer />
				</AppData>
			</TickerData>
		</div>
	);
}
