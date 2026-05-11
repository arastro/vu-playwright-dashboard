<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import type { DashboardMetrics } from '$lib/types/run-summary';
	import { formatDuration, formatPercentage } from '$lib/utils/format-duration';

	let { metrics }: { metrics: DashboardMetrics } = $props();
</script>

<section class="metrics" aria-label="Dashboard metrics">
	<div class="metric">
		<span class="metric__label">Latest run status</span>
		<strong class="metric__value"><StatusBadge status={metrics.latestStatus} /></strong>
	</div>

	<div class="metric">
		<span class="metric__label">Total runs shown</span>
		<strong class="metric__value">{metrics.totalRunsShown}</strong>
	</div>

	<div class="metric">
		<span class="metric__label">Average pass rate</span>
		<strong class="metric__value">{formatPercentage(metrics.averagePassRate)}</strong>
	</div>

	<div class="metric">
		<span class="metric__label">Failed in latest run</span>
		<strong class="metric__value">{metrics.latestFailedTests}</strong>
	</div>

	<div class="metric">
		<span class="metric__label">Average duration</span>
		<strong class="metric__value">{formatDuration(metrics.averageDurationMs)}</strong>
	</div>
</section>

<style>
	.metrics {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	.metric {
		background: #ffffff;
		border: 1px solid #dfe5ee;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		min-height: 7rem;
		padding: 1rem;
	}

	.metric__label {
		color: #61708a;
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1.25;
		text-transform: uppercase;
	}

	.metric__value {
		color: #172033;
		font-size: 1.75rem;
		letter-spacing: 0;
		line-height: 1;
	}

	@media (max-width: 1100px) {
		.metrics {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.metrics {
			grid-template-columns: 1fr;
		}
	}
</style>
