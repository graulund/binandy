import AppData from "./contexts/AppData";
import Gains from "./components/Gains";
import Milestones from "./components/Milestones";
import MoneyThermometer from "./components/MoneyThermometer";
import Ticker from "./components/Ticker";
import TickerData from "./contexts/TickerData";
import UserDerivedData from "./contexts/UserDerivedData";

import styles from "./App.module.css";

export default function App() {
	return (
		<div className={styles.app}>
			<AppData>
				<TickerData>
					<UserDerivedData>
						<Ticker />
						<Gains />
						<Milestones />
						<MoneyThermometer />
					</UserDerivedData>
				</TickerData>
			</AppData>
		</div>
	);
}
