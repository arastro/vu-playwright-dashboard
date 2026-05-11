import { redirect, type RequestHandler } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/auth';

export const POST: RequestHandler = ({ cookies }) => {
	clearSessionCookie(cookies);
	redirect(303, '/login');
};

export const GET: RequestHandler = ({ cookies }) => {
	clearSessionCookie(cookies);
	redirect(303, '/login');
};
