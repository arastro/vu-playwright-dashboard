<script lang="ts">
	import LatestRunCard from '$lib/components/LatestRunCard.svelte';
	import MetricsCards from '$lib/components/MetricsCards.svelte';
	import RunsTable from '$lib/components/RunsTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const latestRun = $derived(data.runs[0] ?? null);
</script>

<svelte:head>
	<title>Playwright Test Dashboard</title>
</svelte:head>

<main class="dashboard">
	<header class="dashboard__header">
		<div>
			<h1>Playwright Test Dashboard</h1>
			<p>Latest Playwright executions loaded server-side from Vercel Blob.</p>
		</div>

		<div class="dashboard__actions">
			<a class="secondary-action" href="/dashboard">Refresh</a>
			<form method="POST" action="/logout">
				<button type="submit">Logout</button>
			</form>
		</div>
	</header>

	{#if data.error}
		<section class="notice notice--error" role="alert">
			<strong>Unable to load runs</strong>
			<p>{data.error}</p>
		</section>
	{/if}

	{#if data.skippedFiles > 0}
		<section class="notice">
			<strong>Some run files were skipped</strong>
			<p>{data.skippedFiles} malformed or unreadable JSON file(s) were ignored.</p>
		</section>
	{/if}

	<MetricsCards metrics={data.metrics} />
	<LatestRunCard run={latestRun} />
	<RunsTable runs={data.runs} />
</main>

<style>
	.dashboard {
		display: grid;
		gap: 1.4rem;
		margin: 0 auto;
		max-width: 1440px;
		padding: 2rem;
	}

	.dashboard__header {
		align-items: flex-start;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
	}

	h1 {
		color: #172033;
		font-size: clamp(2rem, 3vw, 3rem);
		letter-spacing: 0;
		line-height: 1.05;
		margin: 0;
	}

	p {
		color: #61708a;
		margin: 0.6rem 0 0;
	}

	.dashboard__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		justify-content: flex-end;
	}

	.secondary-action,
	button {
		align-items: center;
		border-radius: 6px;
		display: inline-flex;
		font-weight: 800;
		justify-content: center;
		min-height: 2.55rem;
		padding: 0.7rem 0.95rem;
		text-decoration: none;
		white-space: nowrap;
	}

	.secondary-action {
		background: #ffffff;
		border: 1px solid #cdd6e3;
		color: #243047;
	}

	button {
		background: #172033;
		border: 1px solid #172033;
		color: #ffffff;
	}

	.secondary-action:hover,
	button:hover {
		filter: brightness(0.96);
	}

	.notice {
		background: #fff9ea;
		border: 1px solid #f0dba3;
		border-radius: 8px;
		color: #6e4a00;
		padding: 1rem 1.2rem;
	}

	.notice--error {
		background: #fdecec;
		border-color: #f7c4c4;
		color: #9f1d1d;
	}

	.notice strong {
		display: block;
		margin-bottom: 0.3rem;
	}

	.notice p {
		color: inherit;
		margin: 0;
	}

	@media (max-width: 760px) {
		.dashboard {
			padding: 1rem;
		}

		.dashboard__header {
			flex-direction: column;
		}

		.dashboard__actions {
			justify-content: flex-start;
			width: 100%;
		}
	}
</style>
