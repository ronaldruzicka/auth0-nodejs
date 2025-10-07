/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/auth/login',
				destination: 'http://localhost:3003/auth/login',
			},
			{
				source: '/auth/callback',
				destination: 'http://localhost:3003/auth/callback',
			},
			{
				source: '/auth/logout',
				destination: 'http://localhost:3003/auth/logout',
			},
		];
	},
};

export default nextConfig;
