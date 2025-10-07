import { User } from '../components/user';

export default function DashboardPage() {
	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 font-sans text-slate-100">
			<main className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-6 py-12">
				<User />
			</main>
		</div>
	);
}
