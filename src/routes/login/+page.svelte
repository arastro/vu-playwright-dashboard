<script lang="ts">
	let { form }: { form?: { message?: string; username?: string } } = $props();
</script>

<svelte:head>
	<title>Login | Playwright Test Dashboard</title>
</svelte:head>

<main class="login-page">
	<section class="login-panel" aria-labelledby="login-heading">
		<div>
			<p class="eyebrow">Private dashboard</p>
			<h1 id="login-heading">Playwright Test Dashboard</h1>
			<p class="intro">Sign in to view the latest Playwright executions.</p>
		</div>

		<form method="POST">
			{#if form?.message}
				<p class="error" role="alert">{form.message}</p>
			{/if}

			<label>
				<span>Username</span>
				<input
					autocomplete="username"
					name="username"
					required
					type="text"
					value={form?.username ?? ''}
				/>
			</label>

			<label>
				<span>Password</span>
				<input autocomplete="current-password" name="password" required type="password" />
			</label>

			<button type="submit">Sign in</button>
		</form>
	</section>
</main>

<style>
	.login-page {
		align-items: center;
		display: flex;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
	}

	.login-panel {
		background: #ffffff;
		border: 1px solid #dfe5ee;
		border-radius: 8px;
		box-shadow: 0 18px 48px rgb(23 32 51 / 10%);
		display: grid;
		gap: 1.6rem;
		max-width: 28rem;
		padding: 1.6rem;
		width: 100%;
	}

	.eyebrow {
		color: #61708a;
		font-size: 0.78rem;
		font-weight: 800;
		margin: 0 0 0.45rem;
		text-transform: uppercase;
	}

	h1 {
		color: #172033;
		font-size: 1.7rem;
		letter-spacing: 0;
		line-height: 1.15;
		margin: 0;
	}

	.intro {
		color: #61708a;
		margin: 0.65rem 0 0;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.45rem;
	}

	label span {
		color: #344258;
		font-size: 0.9rem;
		font-weight: 700;
	}

	input {
		background: #ffffff;
		border: 1px solid #cdd6e3;
		border-radius: 6px;
		color: #172033;
		min-height: 2.8rem;
		padding: 0.65rem 0.75rem;
		width: 100%;
	}

	input:focus {
		border-color: #2456a6;
		box-shadow: 0 0 0 3px rgb(36 86 166 / 14%);
		outline: none;
	}

	button {
		background: #2456a6;
		border: 0;
		border-radius: 6px;
		color: #ffffff;
		font-weight: 800;
		min-height: 2.8rem;
		padding: 0.75rem 1rem;
	}

	button:hover {
		background: #1d478d;
	}

	.error {
		background: #fdecec;
		border: 1px solid #f7c4c4;
		border-radius: 6px;
		color: #9f1d1d;
		font-weight: 700;
		margin: 0;
		padding: 0.75rem;
	}
</style>
