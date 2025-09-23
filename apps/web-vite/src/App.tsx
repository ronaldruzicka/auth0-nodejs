import { User } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import auth0 from './assets/auth0.svg';

const authURL = import.meta.env.VITE_AUTH_URL;

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSession = useCallback(async () => {
		try {
			const res = await fetch(`${authURL}/session`, {
				credentials: 'include',
			});

			if (!res.ok) {
				throw new Error(`Session check failed: ${res.status}`);
			}

			const data = await res.json();

			setIsAuthenticated(Boolean(data.authenticated));
			setAuthUser(data.user ?? null);
		} catch (err) {
			console.error(err);
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSession();
	}, [fetchSession]);

	const fetchProfile = useCallback(async () => {
		try {
			const res = await fetch(`${authURL}/profile`, {
				credentials: 'include',
			});

			if (res.status === 401) {
				// Not authenticated; trigger a session refresh
				setIsAuthenticated(false);
				setAuthUser(null);
				return;
			}

			if (!res.ok) {
				throw new Error(`Profile fetch failed: ${res.status}`);
			}

			const data = await res.json();
			// Server returns { user: ... }
			setAuthUser(data.user ?? null);
		} catch (e) {
			console.error(e);
			setError((e as Error).message);
		}
	}, []);

	// const handleLogin = async () => {
	// 	await loginWithRedirect();
	// };

	// const handleLogout = async () => {
	// 	await logout({ logoutParams: { returnTo: window.location.origin } });
	// };

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 font-sans text-slate-100">
			<header className="sticky top-0 z-40 flex w-full items-center justify-between gap-6 border-b border-slate-700 bg-slate-900/70 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
				<div className="flex items-center gap-3">
					<img src="/vite.svg" alt="Vite" className="h-8 w-8 drop-shadow" />
					<h1 className="text-xl font-semibold tracking-tight">Auth Demo</h1>
				</div>
				<nav className="hidden items-center gap-6 text-sm md:flex">
					{[
						['Features', '#features'],
						['About', '#about'],
						['FAQ', '#faq'],
					].map(([label, href]) => (
						<a
							key={href}
							href={href}
							className="font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
						>
							{label}
						</a>
					))}
				</nav>
				<div className="flex items-center gap-3">
					{loading && <span className="text-xs text-slate-400">Checking session…</span>}
					{!loading && isAuthenticated && (
						<a
							// onClick={handleLogout}
							href={`${authURL}/logout?returnTo=${encodeURIComponent(window.location.origin)}`}
							className="rounded-md bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-2 text-sm font-medium text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 transition hover:from-slate-600 hover:to-slate-500"
						>
							Logout
						</a>
					)}
					{!loading && !isAuthenticated && (
						<a
							// onClick={handleLogin}
							href={`${authURL}/login`}
							className="relative overflow-hidden rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
						>
							Login
						</a>
					)}
				</div>
			</header>
			<main className="mx-auto w-full max-w-6xl flex-1 space-y-24 px-6 py-16">
				<section className="space-y-8 text-center">
					<div className="flex items-center justify-center gap-10">
						<img src={auth0} className="logo react h-20 w-20" alt="Auth0 logo" />
					</div>
					<h2 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
						Auth0 + Vite React App
					</h2>
					<p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-slate-300">
						A minimal playground to wire up authentication. This page is intentionally simple so you
						can focus on integrating identity flows (login, logout, profile retrieval, route
						protection).
					</p>
				</section>
				<section className="space-y-4">
					<div className="flex gap-3">
						<button
							className="rounded-md bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-2 text-sm font-medium text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 transition hover:from-slate-600 hover:to-slate-500 disabled:opacity-40"
							disabled={!isAuthenticated}
							onClick={fetchProfile}
						>
							Fetch profile (session)
						</button>
						<button
							className="rounded-md border border-slate-600 px-5 py-2 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
							onClick={fetchSession}
						>
							Refresh session state
						</button>
					</div>
					{error && <p className="text-xs text-rose-400">{error}</p>}
					<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
						<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
							Session
						</h4>
						<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
							{loading ? 'Loading…' : JSON.stringify({ isAuthenticated, user: authUser }, null, 2)}
						</pre>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
