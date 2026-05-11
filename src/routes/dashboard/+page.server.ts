import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/server/auth';
import { loadLatestRuns } from '$lib/server/runs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!(await isAuthenticated(cookies))) {
		redirect(303, '/login');
	}

	return loadLatestRuns();
};
