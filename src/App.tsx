import AppData from "./contexts/AppData";
import CurrencyRateDisplay from "./components/CurrencyRateDisplay";
import DocTitleUpdater from "./components/DocTitleUpdater";
import Gains from "./components/Gains";
import Milestones from "./components/Milestones";
import MoneyThermometer from "./components/MoneyThermometer";
import SubtleSwitch from "./components/SubtleSwitch";
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
					<CurrencyRateDisplay />
					<MoneyThermometer />
					<SubtleSwitch />
					<DocTitleUpdater />
				</AppData>
			</TickerData>
		</div>
	);
}
