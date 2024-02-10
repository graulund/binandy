import styles from "./AppStatus.module.css";

type AppStatusProps = {
	error?: string | undefined;
	loading?: boolean;
};

export default function AppStatus({
	error = undefined,
	loading = false
}: AppStatusProps) {
	if (error) {
		return <div className={styles.error}>Error: {error}</div>;
	}

	if (loading) {
		return <div className={styles.loading}>Loading…</div>;
	}

	return null;
}
