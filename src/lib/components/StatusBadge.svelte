<script lang="ts">
	let { status = 'unknown' }: { status?: string } = $props();

	function normalizeStatus(value: string): string {
		return value.toLowerCase().replace(/\s+/g, '_') || 'unknown';
	}

	function getVariant(value: string): string {
		if (['passed', 'pass', 'success', 'succeeded'].includes(value)) {
			return 'passed';
		}

		if (['failed', 'failure', 'error'].includes(value)) {
			return 'failed';
		}

		if (['skipped', 'skip', 'cancelled', 'canceled'].includes(value)) {
			return 'skipped';
		}

		if (['timed_out', 'timeout', 'timedout', 'interrupted'].includes(value)) {
			return 'warning';
		}

		return 'unknown';
	}

	const normalizedStatus = $derived(normalizeStatus(status));
	const variant = $derived(getVariant(normalizedStatus));
	const label = $derived(normalizedStatus.replace(/_/g, ' '));
</script>

<span class="status status--{variant}">{label}</span>

<style>
	.status {
		align-items: center;
		border: 1px solid transparent;
		border-radius: 999px;
		display: inline-flex;
		font-size: 0.78rem;
		font-weight: 700;
		gap: 0.35rem;
		letter-spacing: 0;
		line-height: 1;
		padding: 0.42rem 0.68rem;
		text-transform: capitalize;
		white-space: nowrap;
	}

	.status::before {
		border-radius: 999px;
		content: '';
		height: 0.48rem;
		width: 0.48rem;
	}

	.status--passed {
		background: #e8f7ef;
		border-color: #b9e5cc;
		color: #126136;
	}

	.status--passed::before {
		background: #1f9d55;
	}

	.status--failed {
		background: #fdecec;
		border-color: #f7c4c4;
		color: #9f1d1d;
	}

	.status--failed::before {
		background: #dc2626;
	}

	.status--skipped {
		background: #eef2f7;
		border-color: #d4dce8;
		color: #40536d;
	}

	.status--skipped::before {
		background: #64748b;
	}

	.status--warning {
		background: #fff4df;
		border-color: #f4d59a;
		color: #8a5200;
	}

	.status--warning::before {
		background: #d97706;
	}

	.status--unknown {
		background: #f4f1f8;
		border-color: #ddd6e8;
		color: #514462;
	}

	.status--unknown::before {
		background: #7c6f8f;
	}
</style>
