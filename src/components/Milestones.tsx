import React, { useContext } from "react";
import clsx from "clsx";

import AppData from "../contexts/AppData";
import TickerData from "../contexts/TickerData";
import TickerLabel from "./TickerLabel";
import { DerivedValues } from "../lib/derivedData";
import {
	formatCryptoAmount,
	formatCurrency,
	formatLocalCurrency
} from "../lib/formatNumbers";
import { floorToNthDecimal, getThousandFromValue } from "../lib/numbers";

import styles from "./Milestones.module.css";

const milestoneAmountDecimalLevel = 3;

type MilestonesRowProps = {
	amountDecimalLevel?: number;
	getRequiredPriceForDesiredAmount:
		DerivedValues["getRequiredPriceForDesiredAmount"];
	getRequiredPriceForDesiredLocalHoldings:
		DerivedValues["getRequiredPriceForDesiredLocalHoldings"];
	currentPrice: number;
	subtle: boolean;
	values: number[];
	valuesAreAmounts: boolean;
};

function MilestonesRow({
	amountDecimalLevel,
	getRequiredPriceForDesiredAmount,
	getRequiredPriceForDesiredLocalHoldings,
	currentPrice,
	subtle,
	values,
	valuesAreAmounts
}: MilestonesRowProps) {
	const className = clsx(styles.milestones, {
		[styles.subtleMilestones]: subtle
	});

	const numberFormatter = valuesAreAmounts
		? (
			amountDecimalLevel
				? (n: number) => n.toFixed(amountDecimalLevel)
				: formatCryptoAmount
		)
		: formatLocalCurrency;

	return (
		<div className={className}>
			{values.map((value) => {
				const goalPrice = valuesAreAmounts
					? getRequiredPriceForDesiredAmount(value)
					: getRequiredPriceForDesiredLocalHoldings(value);
				const difference = currentPrice - goalPrice;

				const differenceClassName = clsx(styles.difference, {
					[styles.differenceAbove]: difference > 0,
					[styles.differenceBelow]: difference < 0
				});

				return (
					<div className={styles.milestone} key={value}>
						<TickerLabel size="small">
							{numberFormatter(value)} at:
						</TickerLabel>
						<div className={styles.value}>
							{formatCurrency(goalPrice)}
						</div>
						<div className={differenceClassName}>
							(
								{difference >= 0 ? "+" : undefined}
								{formatCurrency(difference)}
							)
						</div>
					</div>
				);
			})}
		</div>
	)
}

export default function Milestones() {
	const appData = useContext(AppData.Context);
	const tickerData = useContext(TickerData.Context);

	const { config, derived } = appData;
	const { amountIn = 0, amountToSpend = 0, subtle = false } = config || {};
	const price = tickerData.data?.closePrice;

	if (
		!price ||
		!appData ||
		!derived ||
		(amountIn <= 0 && amountToSpend <= 0)
	) {
		return null;
	}

	const {
		getRequiredPriceForDesiredAmount,
		getRequiredPriceForDesiredLocalHoldings,
		localHoldings = 0,
		maxBuy = 0
	} = derived;

	const rowProps = {
		currentPrice: price,
		getRequiredPriceForDesiredAmount,
		getRequiredPriceForDesiredLocalHoldings,
		subtle
	};

	const content: React.ReactNode[] = [];

	if (amountIn > 0) {
		// One value for each thousand DKK around the current price, 1 lower, 4 higher

		const currentThousand = getThousandFromValue(localHoldings);

		const localMilestoneValues = [
			currentThousand,
			currentThousand + 1000,
			currentThousand + 2000,
			currentThousand + 3000,
			currentThousand + 4000
		];

		content.push(
			<React.Fragment key="holdings">
				<TickerLabel size="small">
					Nearby holdings milestones:
				</TickerLabel>
				<MilestonesRow
					{...rowProps}
					values={localMilestoneValues}
					valuesAreAmounts={false}
				/>
			</React.Fragment>
		);
	}

	if (amountToSpend > 0) {
		// One value for each 0.001 around max buy, 1 lower, 4 higher

		const currentFlooredMaxBuy = floorToNthDecimal(
			maxBuy,
			milestoneAmountDecimalLevel
		);

		const amountMilestoneValues = [
			currentFlooredMaxBuy,
			currentFlooredMaxBuy + Math.pow(10, -milestoneAmountDecimalLevel),
			currentFlooredMaxBuy + 2 * Math.pow(10, -milestoneAmountDecimalLevel),
			currentFlooredMaxBuy + 3 * Math.pow(10, -milestoneAmountDecimalLevel),
			currentFlooredMaxBuy + 4 * Math.pow(10, -milestoneAmountDecimalLevel)
		];

		content.push(
			<React.Fragment key="amount">
				<TickerLabel size="small">
					Nearby max buy milestones:
				</TickerLabel>
				<MilestonesRow
					{...rowProps}
					amountDecimalLevel={milestoneAmountDecimalLevel}
					values={amountMilestoneValues}
					valuesAreAmounts
				/>
			</React.Fragment>
		);
	}

	return content;
}
