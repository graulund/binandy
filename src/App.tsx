import AppData from "./contexts/AppData";
import Milestones from "./components/Milestones";
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
						<Milestones />
					</UserDerivedData>
				</TickerData>
			</AppData>
		</div>
	);
}
