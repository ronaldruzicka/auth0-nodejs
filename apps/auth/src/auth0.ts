import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ServerClient, CookieTransactionStore, StatelessStateStore } from '@auth0/auth0-server-js';
import type { StoreOptions } from './types.js';
import { FastifyCookieHandler } from './store/fastify-cookie-handler.js';

export const ALLOWED_ORIGINS = ['http://localhost:5173'];

export function getReturnTo(
	request: FastifyRequest<{ Querystring: { returnTo?: string } }>,
	options: Auth0FastifyOptions,
) {
	const returnToParam = request.query['returnTo'];
	const requested = typeof returnToParam === 'string' ? returnToParam : undefined;

	const returnTo =
		requested && ALLOWED_ORIGINS.some((origin) => requested?.includes(origin))
			? requested
			: options.appBaseUrl;

	return returnTo;
}

declare module 'fastify' {
	interface FastifyInstance {
		auth0Client: ServerClient<StoreOptions> | undefined;
	}
}

export interface Auth0FastifyOptions {
	domain: string;
	clientId: string;
	clientSecret: string;
	appBaseUrl: string;
	sessionSecret: string;
}

type WithReturnTo = FastifyRequest<{ Querystring: { returnTo?: string } }>;

export default fp(async function auth0Fastify(
	fastify: FastifyInstance,
	options: Auth0FastifyOptions,
) {
	const callbackPath = '/auth/callback';
	const redirectUri = new URL(callbackPath, options.appBaseUrl);

	const auth0Client = new ServerClient<StoreOptions>({
		domain: options.domain,
		clientId: options.clientId,
		clientSecret: options.clientSecret,
		authorizationParams: {
			redirect_uri: redirectUri.toString(),
		},
		transactionStore: new CookieTransactionStore(
			{
				secret: options.sessionSecret,
			},
			new FastifyCookieHandler(),
		),
		stateStore: new StatelessStateStore(
			{
				secret: options.sessionSecret,
			},
			new FastifyCookieHandler(),
		),
	});

	fastify.get('/auth/login', async (request: WithReturnTo, reply) => {
		const returnTo = getReturnTo(request, options);

		console.log('💬 ~ auth0Fastify ~ returnTo:', returnTo);

		const authorizationUrl = await auth0Client.startInteractiveLogin(
			{
				appState: { returnTo },
			},
			{ request, reply },
		);

		reply.redirect(authorizationUrl.href);
	});

	fastify.get('/auth/callback', async (request, reply) => {
		const { appState } = await auth0Client.completeInteractiveLogin<
			{ returnTo: string } | undefined
		>(new URL(request.url, options.appBaseUrl), { request, reply });

		console.log('💬 ~ auth0Fastify ~ appState:', appState);
		reply.redirect(appState?.returnTo ?? options.appBaseUrl);
	});

	fastify.get('/auth/logout', async (request: WithReturnTo, reply) => {
		const returnTo = getReturnTo(request, options);

		console.log('💬 ~ auth0Fastify ~ returnTo:', returnTo);

		const logoutUrl = await auth0Client.logout(
			{ returnTo: returnTo.toString() },
			{ request, reply },
		);

		reply.redirect(logoutUrl.href);
	});

	fastify.decorate('auth0Client', auth0Client);
});
