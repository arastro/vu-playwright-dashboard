import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'playwright_dashboard_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getConfiguredCredentials() {
	const user = env.DASHBOARD_USER;
	const password = env.DASHBOARD_PASSWORD;

	return { user, password };
}

function constantTimeEqual(left: string, right: string): boolean {
	if (!left || !right) {
		return false;
	}

	let difference = left.length ^ right.length;
	const maxLength = Math.max(left.length, right.length);

	for (let index = 0; index < maxLength; index += 1) {
		const leftCode = left.charCodeAt(index % left.length);
		const rightCode = right.charCodeAt(index % right.length);
		difference |= leftCode ^ rightCode;
	}

	return difference === 0;
}

async function sha256(value: string): Promise<string> {
	const encodedValue = new TextEncoder().encode(value);
	const hash = await crypto.subtle.digest('SHA-256', encodedValue);

	return Array.from(new Uint8Array(hash))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

async function getSessionToken(): Promise<string | null> {
	const { user, password } = getConfiguredCredentials();

	if (!user || !password) {
		return null;
	}

	return sha256(`${user}:${password}`);
}

export function areCredentialsConfigured(): boolean {
	const { user, password } = getConfiguredCredentials();

	return Boolean(user && password);
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
	const configured = getConfiguredCredentials();

	if (!configured.user || !configured.password) {
		return false;
	}

	return (
		constantTimeEqual(username, configured.user) &&
		constantTimeEqual(password, configured.password)
	);
}

export async function isAuthenticated(cookies: Cookies): Promise<boolean> {
	const expectedToken = await getSessionToken();
	const sessionToken = cookies.get(SESSION_COOKIE);

	if (!expectedToken || !sessionToken) {
		return false;
	}

	return constantTimeEqual(sessionToken, expectedToken);
}

export async function setSessionCookie(cookies: Cookies): Promise<void> {
	const token = await getSessionToken();

	if (!token) {
		return;
	}

	cookies.set(SESSION_COOKIE, token, {
		httpOnly: true,
		maxAge: SESSION_MAX_AGE_SECONDS,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE, {
		path: '/'
	});
}
