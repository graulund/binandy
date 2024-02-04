import styles from "./TickerValueInput.module.css";

type TickerValueInputProps = {
	id?: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	value: number;
};

export default function TickerValueInput({
	id,
	onChange,
	value
}: TickerValueInputProps) {
	return (
		<div className={styles.valueInput}>
			<input
				type="number"
				id={id}
				onChange={onChange}
				value={value}
			/>
		</div>
	);
}
