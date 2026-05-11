<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import type { RunSummary } from '$lib/types/run-summary';
	import { formatDate } from '$lib/utils/format-date';
	import { formatDuration } from '$lib/utils/format-duration';

	let { run }: { run: RunSummary | null } = $props();
</script>

<section class="latest" aria-labelledby="latest-run-heading">
	<div class="latest__heading">
		<div>
			<p class="eyebrow">Latest run</p>
			<h2 id="latest-run-heading">
				{run?.runNumber ? `Run #${run.runNumber}` : 'No executions yet'}
			</h2>
		</div>

		{#if run}
			<StatusBadge status={run.status} />
		{/if}
	</div>

	{#if run}
		<div class="latest__grid">
			<div>
				<span>Status</span>
				<strong><StatusBadge status={run.status} /></strong>
			</div>
			<div>
				<span>Run number</span>
				<strong>{run.runNumber ?? 'Unknown'}</strong>
			</div>
			<div>
				<span>Branch</span>
				<strong>{run.branch}</strong>
			</div>
			<div>
				<span>Environment</span>
				<strong>{run.environment}</strong>
			</div>
			<div>
				<span>Triggered by</span>
				<strong>{run.triggeredBy}</strong>
			</div>
			<div>
				<span>Trigger</span>
				<strong>{run.trigger}</strong>
			</div>
			<div>
				<span>Duration</span>
				<strong>{formatDuration(run.durationMs)}</strong>
			</div>
			<div>
				<span>Date</span>
				<strong>{formatDate(run.date)}</strong>
			</div>
			<div class="latest__wide">
				<span>Browsers</span>
				<strong>{run.browsers.join(', ')}</strong>
			</div>
			<div class="latest__wide">
				<span>Passed / Failed / Skipped / Flaky</span>
				<strong>{run.passed} / {run.failed} / {run.skipped} / {run.flaky}</strong>
			</div>
		</div>
	{:else}
		<p class="empty">No Playwright executions were found in Vercel Blob under the runs/ prefix.</p>
	{/if}
</section>

<style>
	.latest {
		background: #ffffff;
		border: 1px solid #dfe5ee;
		border-radius: 8px;
		padding: 1.25rem;
	}

	.latest__heading {
		align-items: flex-start;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}

	.eyebrow {
		color: #61708a;
		font-size: 0.8rem;
		font-weight: 800;
		margin: 0 0 0.35rem;
		text-transform: uppercase;
	}

	h2 {
		color: #172033;
		font-size: 1.45rem;
		letter-spacing: 0;
		line-height: 1.15;
		margin: 0;
	}

	.latest__grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.latest__grid div {
		min-width: 0;
	}

	.latest__grid span {
		color: #61708a;
		display: block;
		font-size: 0.82rem;
		font-weight: 700;
		margin-bottom: 0.35rem;
	}

	.latest__grid strong {
		color: #172033;
		display: block;
		font-size: 0.98rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.latest__wide {
		grid-column: span 2;
	}

	.empty {
		color: #61708a;
		margin: 0;
	}

	@media (max-width: 900px) {
		.latest__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.latest__heading {
			flex-direction: column;
		}

		.latest__grid {
			grid-template-columns: 1fr;
		}

		.latest__wide {
			grid-column: auto;
		}
	}
</style>
