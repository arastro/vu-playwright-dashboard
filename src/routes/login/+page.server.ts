import { fail, redirect } from '@sveltejs/kit';
import {
	areCredentialsConfigured,
	isAuthenticated,
	setSessionCookie,
	validateCredentials
} from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (await isAuthenticated(cookies)) {
		redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = String(formData.get('username') ?? '');
		const password = String(formData.get('password') ?? '');

		if (!areCredentialsConfigured()) {
			return fail(500, {
				message: 'Dashboard credentials are not configured.',
				username
			});
		}

		if (!(await validateCredentials(username, password))) {
			return fail(400, {
				message: 'Invalid username or password.',
				username
			});
		}

		await setSessionCookie(cookies);
		redirect(303, '/dashboard');
	}
};
