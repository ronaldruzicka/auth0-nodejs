'use client';

import { useUser } from '@auth0/nextjs-auth0';

export function User() {
	const { user, isLoading } = useUser();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<>
			<section className="space-y-6">
				<h2 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
					Welcome back{user?.name ? `, ${user.name}` : ''}!
				</h2>
				<p className="max-w-2xl text-sm leading-relaxed text-slate-300">
					This protected page is rendered entirely on the server. If you reload, the session is
					revalidated before any HTML is streamed to the browser.
				</p>
			</section>
			<section className="space-y-4">
				<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
					<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
						User Claims
					</h4>
					<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
						{JSON.stringify(user, null, 2)}
					</pre>
				</div>
			</section>
		</>
	);
}
