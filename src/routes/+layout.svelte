<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Playwright execution dashboard backed by Vercel Blob run summaries"
	/>
</svelte:head>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		background: #f3f6fa;
		color: #172033;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	:global(body) {
		margin: 0;
		min-width: 320px;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	:global(button) {
		cursor: pointer;
	}
</style>
