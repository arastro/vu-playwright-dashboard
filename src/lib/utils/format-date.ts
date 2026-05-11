export function formatDate(value: string | null): string {
	if (!value) {
		return 'Unknown';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return 'Unknown';
	}

	return new Intl.DateTimeFormat('en', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}
