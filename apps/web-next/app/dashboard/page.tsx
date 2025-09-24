import { redirect } from 'next/navigation';
import { getSession } from '../../lib/get-session';

export const dynamic = 'force-dynamic';

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3000';
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:4040';
const RETURN_TO = `${APP_BASE_URL}/dashboard`;
const LOGIN_URL = `${AUTH_API}/auth/login?returnTo=${encodeURIComponent(RETURN_TO)}`;

export default async function DashboardPage() {
	const session = await getSession();

	if (!session.isAuthenticated) {
		// Redirect unauthenticated users through Auth0 login flow
		redirect(LOGIN_URL);
	}

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 font-sans text-slate-100">
			<main className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-6 py-12">
				<section className="space-y-6">
					<h2 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
						Welcome back{session.user?.name ? `, ${session.user.name}` : ''}!
					</h2>
					<p className="max-w-2xl text-sm leading-relaxed text-slate-300">
						This protected page is rendered entirely on the server. If you reload, the session is
						revalidated before any HTML is streamed to the browser.
					</p>
				</section>
				<section className="space-y-4">
					<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
						<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
							Session
						</h4>
						<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
							{JSON.stringify(session, null, 2)}
						</pre>
					</div>
					<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
						<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
							User Claims
						</h4>
						<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
							{JSON.stringify(session.user, null, 2)}
						</pre>
					</div>
				</section>
			</main>
		</div>
	);
}
