import Ticker from "./Ticker";
import TickerData from "./TickerData";
import "./App.css";

function App() {
	return (
		<div className="App">
			<TickerData>
				<Ticker />
			</TickerData>
		</div>
	);
}

export default App;
