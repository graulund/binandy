import clsx from "clsx";

import useSubtle from "../hooks/useSubtle";

import styles from "./TickerValueInput.module.css";

type TickerValueInputProps = {
	id?: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	value: string | number;
};

export default function TickerValueInput({
	id,
	onChange,
	placeholder,
	value
}: TickerValueInputProps) {
	const subtle = useSubtle();

	const className = clsx(styles.valueInput, {
		[styles.subtleInput]: subtle
	});

	return (
		<div className={className}>
			<input
				type="number"
				id={id}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
			/>
		</div>
	);
}
