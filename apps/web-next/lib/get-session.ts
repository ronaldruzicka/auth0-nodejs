import { cookies } from 'next/headers';

interface SessionUser {
	sub?: string;
	name?: string;
	email?: string;
	[key: string]: unknown;
}

interface SessionData {
	isAuthenticated: boolean;
	user: SessionUser | null;
}

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3000';

export async function getSession(): Promise<SessionData> {
	// Reconstruct a standard Cookie header from Next's cookies store
	const cookieStore = await cookies();

	// Next's cookies() returns a ReadonlyRequestCookies iterable; use .getAll if available, otherwise iterate.
	const rawList: Array<{ name: string; value: string }> =
		'getAll' in cookieStore && typeof cookieStore.getAll === 'function'
			? cookieStore.getAll()
			: // Fallback: attempt to spread (may be empty in build time without request context)
				[];

	const cookieHeader = rawList
		.map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
		.join('; ');

	const res = await fetch(`${AUTH_API}/session`, {
		headers: { cookie: cookieHeader },
		// Do not cache so each request reflects up-to-date session state
		cache: 'no-store',
	});

	if (!res.ok) {
		return { isAuthenticated: false, user: null }; // fallback
	}

	return (await res.json()) as SessionData;
}
