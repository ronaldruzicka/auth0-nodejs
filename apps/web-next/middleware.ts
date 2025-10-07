import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
	// Log only cookies whose names start with one or more underscores followed by "a0_session"
	const cookieHeader = request.headers.get('cookie');

	if (cookieHeader) {
		cookieHeader
			.split(';')
			.map((part) => part.trim())
			.filter(Boolean)
			.forEach((pair) => {
				const idx = pair.indexOf('=');
				const name = idx === -1 ? pair : pair.slice(0, idx);
				const value = idx === -1 ? '' : pair.slice(idx + 1);
				const decoded = decodeURIComponent(value);

				console.log(`[middleware] cookie ${name}=${decoded.slice(0, 10)}...`);
			});
	} else {
		console.log('[middleware] no Cookie header present');
	}
	console.log('');

	return await auth0.middleware(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
