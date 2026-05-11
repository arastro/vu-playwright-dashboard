export interface RunSummary {
	runId: string;
	runNumber: number | null;
	runAttempt: number | null;
	date: string | null;
	triggeredBy: string;
	trigger: string;
	branch: string;
	commit: string;
	commitMessage: string;
	environment: string;
	status: string;
	total: number;
	passed: number;
	failed: number;
	skipped: number;
	flaky: number;
	durationMs: number;
	browsers: string[];
	reportUrl: string | null;
	githubRunUrl: string | null;
	createdAt: string | null;
}

export interface DashboardMetrics {
	latestStatus: string;
	totalRunsShown: number;
	averagePassRate: number;
	latestFailedTests: number;
	averageDurationMs: number;
}

export interface RunsLoadResult {
	runs: RunSummary[];
	metrics: DashboardMetrics;
	error: string | null;
	skippedFiles: number;
}
