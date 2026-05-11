<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import type { RunSummary } from '$lib/types/run-summary';
	import { formatDate } from '$lib/utils/format-date';
	import { formatDuration } from '$lib/utils/format-duration';

	let { runs }: { runs: RunSummary[] } = $props();
</script>

<section class="executions" aria-labelledby="recent-executions-heading">
	<div class="executions__heading">
		<h2 id="recent-executions-heading">Recent executions</h2>
		<p>Latest 30 run summaries from Vercel Blob.</p>
	</div>

	{#if runs.length > 0}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Run number</th>
						<th>Status</th>
						<th>Branch</th>
						<th>Environment</th>
						<th>Passed</th>
						<th>Failed</th>
						<th>Skipped</th>
						<th>Flaky</th>
						<th>Duration</th>
						<th>Date</th>
						<th>Triggered by</th>
						<th>Browser(s)</th>
						<th>Links</th>
					</tr>
				</thead>
				<tbody>
					{#each runs as run (run.runId)}
						<tr>
							<td>{run.runNumber ?? 'Unknown'}</td>
							<td><StatusBadge status={run.status} /></td>
							<td>{run.branch}</td>
							<td>{run.environment}</td>
							<td>{run.passed}</td>
							<td>{run.failed}</td>
							<td>{run.skipped}</td>
							<td>{run.flaky}</td>
							<td>{formatDuration(run.durationMs)}</td>
							<td>{formatDate(run.date)}</td>
							<td>{run.triggeredBy}</td>
							<td>{run.browsers.join(', ')}</td>
							<td>
								<div class="links">
									{#if run.reportUrl}
										<a href={run.reportUrl} target="_blank" rel="noreferrer">Open Report</a>
									{/if}
									{#if run.githubRunUrl}
										<a href={run.githubRunUrl} target="_blank" rel="noreferrer">Open GitHub Run</a>
									{/if}
									{#if !run.reportUrl && !run.githubRunUrl}
										<span>None</span>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="empty">No executions are available yet.</p>
	{/if}
</section>

<style>
	.executions {
		background: #ffffff;
		border: 1px solid #dfe5ee;
		border-radius: 8px;
		overflow: hidden;
	}

	.executions__heading {
		border-bottom: 1px solid #dfe5ee;
		padding: 1rem 1.25rem;
	}

	h2 {
		color: #172033;
		font-size: 1.15rem;
		letter-spacing: 0;
		line-height: 1.2;
		margin: 0 0 0.35rem;
	}

	p {
		color: #61708a;
		margin: 0;
	}

	.table-wrap {
		overflow-x: auto;
		width: 100%;
	}

	table {
		border-collapse: collapse;
		min-width: 1180px;
		width: 100%;
	}

	th,
	td {
		border-bottom: 1px solid #edf1f6;
		color: #243047;
		font-size: 0.88rem;
		line-height: 1.35;
		padding: 0.85rem 0.9rem;
		text-align: left;
		vertical-align: middle;
	}

	th {
		background: #f7f9fc;
		color: #61708a;
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		white-space: nowrap;
	}

	td {
		overflow-wrap: anywhere;
	}

	tbody tr:last-child td {
		border-bottom: 0;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		min-width: 12rem;
	}

	a {
		color: #2456a6;
		font-weight: 700;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.links span,
	.empty {
		color: #728096;
	}

	.empty {
		margin: 0;
		padding: 1.25rem;
	}
</style>
