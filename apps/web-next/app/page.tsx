import Image from 'next/image';
import { getSession } from '../lib/get-session';

export default async function Home() {
	const session = await getSession();

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 font-sans text-slate-100">
			<main className="mx-auto w-full max-w-6xl flex-1 space-y-24 px-6 py-16">
				<section className="space-y-8 text-center">
					<div className="flex items-center justify-center gap-10">
						<Image
							src="/auth0.svg"
							width={80}
							height={80}
							alt="Auth0 logo"
							className="opacity-90"
						/>
					</div>
					<h2 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm">
						Auth0 + Next.js App (Server Auth)
					</h2>
					<p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-slate-300">
						This page fetches the session on the server with a Server Component. Page HTML is
						personalized before it reaches the browser. Use this as a foundation for protected
						pages, streaming layouts, or RSC-driven personalization.
					</p>
				</section>
				<section className="space-y-4">
					<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
						<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
							Session (server-rendered)
						</h4>
						<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
							{JSON.stringify(session, null, 2)}
						</pre>
					</div>
					{session.isAuthenticated && (
						<div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-left">
							<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
								User Claims
							</h4>
							<pre className="whitespace-pre-wrap break-all text-xs text-slate-300">
								{JSON.stringify(session.user, null, 2)}
							</pre>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
