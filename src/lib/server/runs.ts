import type { ListBlobResultBlob } from '@vercel/blob';
import { listRunBlobs, readBlobText } from './blob';
import type { DashboardMetrics, RunSummary, RunsLoadResult } from '$lib/types/run-summary';

interface ParsedRunSummary extends RunSummary {
	sortTimestamp: number;
}

const UNKNOWN = 'Unknown';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = UNKNOWN): string {
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function nullableStringValue(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown, fallback = 0): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.max(0, value);
	}

	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
	}

	return fallback;
}

function nullableNumberValue(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
}

function browserList(value: unknown): string[] {
	if (Array.isArray(value)) {
		const browsers = value
			.filter((browser): browser is string => typeof browser === 'string')
			.map((browser) => browser.trim())
			.filter(Boolean);

		return browsers.length > 0 ? browsers : [UNKNOWN];
	}

	if (typeof value === 'string' && value.trim()) {
		return value
			.split(',')
			.map((browser) => browser.trim())
			.filter(Boolean);
	}

	return [UNKNOWN];
}

function validUrl(value: unknown): string | null {
	if (typeof value !== 'string' || !value.trim()) {
		return null;
	}

	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
	} catch {
		return null;
	}
}

function normalizeStatus(value: unknown, failed: number, total: number, passed: number): string {
	const status = stringValue(value, '').toLowerCase().replace(/\s+/g, '_');

	if (status) {
		return status;
	}

	if (failed > 0) {
		return 'failed';
	}

	if (total > 0 && passed === total) {
		return 'passed';
	}

	return 'unknown';
}

function validDateString(value: string | null): string | null {
	if (!value) {
		return null;
	}

	const timestamp = new Date(value).getTime();

	if (!Number.isFinite(timestamp)) {
		return null;
	}

	return value;
}

function parseTimestamp(value: string): number {
	const timestamp = new Date(value).getTime();

	return Number.isFinite(timestamp) ? timestamp : 0;
}

function parseRunSummary(rawValue: unknown, blob: ListBlobResultBlob): ParsedRunSummary | null {
	if (!isRecord(rawValue)) {
		return null;
	}

	const passed = numberValue(rawValue.passed);
	const failed = numberValue(rawValue.failed);
	const skipped = numberValue(rawValue.skipped);
	const flaky = numberValue(rawValue.flaky);
	const total = numberValue(rawValue.total, passed + failed + skipped + flaky);
	const createdAt = validDateString(nullableStringValue(rawValue.createdAt));
	const date =
		validDateString(nullableStringValue(rawValue.date)) ?? createdAt ?? blob.uploadedAt.toISOString();

	return {
		branch: stringValue(rawValue.branch),
		browsers: browserList(rawValue.browsers),
		commit: stringValue(rawValue.commit, ''),
		commitMessage: stringValue(rawValue.commitMessage, ''),
		createdAt,
		date,
		durationMs: numberValue(rawValue.durationMs),
		environment: stringValue(rawValue.environment),
		failed,
		flaky,
		githubRunUrl: validUrl(rawValue.githubRunUrl),
		passed,
		reportUrl: validUrl(rawValue.reportUrl),
		runAttempt: nullableNumberValue(rawValue.runAttempt),
		runId: stringValue(rawValue.runId, blob.pathname),
		runNumber: nullableNumberValue(rawValue.runNumber),
		skipped,
		sortTimestamp: parseTimestamp(date),
		status: normalizeStatus(rawValue.status, failed, total, passed),
		total,
		trigger: stringValue(rawValue.trigger),
		triggeredBy: stringValue(rawValue.triggeredBy)
	};
}

function calculateMetrics(runs: RunSummary[]): DashboardMetrics {
	const totalRunsShown = runs.length;
	const latestRun = runs[0];

	if (!latestRun || totalRunsShown === 0) {
		return {
			averageDurationMs: 0,
			averagePassRate: 0,
			latestFailedTests: 0,
			latestStatus: 'unknown',
			totalRunsShown: 0
		};
	}

	const averagePassRate =
		runs.reduce((totalPassRate, run) => {
			const passRate = run.total > 0 ? (run.passed / run.total) * 100 : 0;
			return totalPassRate + passRate;
		}, 0) / totalRunsShown;
	const averageDurationMs =
		runs.reduce((totalDuration, run) => totalDuration + run.durationMs, 0) / totalRunsShown;

	return {
		averageDurationMs,
		averagePassRate,
		latestFailedTests: latestRun.failed,
		latestStatus: latestRun.status,
		totalRunsShown
	};
}

export async function loadLatestRuns(): Promise<RunsLoadResult> {
	try {
		const blobs = await listRunBlobs();
		const settledRuns = await Promise.allSettled(
			blobs.map(async (blob) => {
				const text = await readBlobText(blob);
				return parseRunSummary(JSON.parse(text), blob);
			})
		);

		const parsedRuns = settledRuns
			.flatMap((result) => (result.status === 'fulfilled' && result.value ? [result.value] : []))
			.sort((left, right) => right.sortTimestamp - left.sortTimestamp)
		const runs = parsedRuns
			.slice(0, 30)
			.map(({ sortTimestamp: _sortTimestamp, ...run }) => run);
		const skippedFiles = settledRuns.length - parsedRuns.length;

		return {
			error: null,
			metrics: calculateMetrics(runs),
			runs,
			skippedFiles
		};
	} catch (error) {
		console.error('Failed to load Playwright run summaries from Vercel Blob.', error);

		return {
			error:
				'We could not load the Playwright executions from storage. Please refresh the page or try again in a moment.',
			metrics: calculateMetrics([]),
			runs: [],
			skippedFiles: 0
		};
	}
}
