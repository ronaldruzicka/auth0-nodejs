import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { CookieTransactionStore, ServerClient, StatelessStateStore } from '@auth0/auth0-server-js';
import { StoreOptions } from './types.js';
import { ExpressCookieHandler } from './store/express-cookie-handler.js';

export interface Auth0ExpressOptions {
	domain: string;
	clientId: string;
	clientSecret: string;
	appBaseUrl: string;
	sessionSecret: string;
}

declare module 'express' {
	interface Request {
		auth0Client: ServerClient<StoreOptions>;
	}
}

export const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:4040'];

export function auth0(options: Auth0ExpressOptions) {
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
			new ExpressCookieHandler(),
		),
		stateStore: new StatelessStateStore(
			{
				secret: options.sessionSecret,
			},
			new ExpressCookieHandler(),
		),
	});

	const router = new express.Router();

	router.use(async (req: Request, _res: Response, next: NextFunction) => {
		req.auth0Client = auth0Client;
		next();
	});

	router.get('/auth/login', async (request: Request, response: Response) => {
		const returnToParam = request.query['returnTo'];
		const requested = typeof returnToParam === 'string' ? returnToParam : undefined;

		const returnTo =
			requested && ALLOWED_ORIGINS.some((origin) => requested?.includes(origin))
				? requested
				: options.appBaseUrl;

		const authorizationUrl = await request.auth0Client.startInteractiveLogin(
			{
				appState: { returnTo },
			},
			{ request, response },
		);

		response.redirect(authorizationUrl.href);
	});

	router.get('/auth/callback', async (request: Request, response: Response) => {
		console.log('💬 ~ newURL:', new URL(request.url, options.appBaseUrl).toString());

		const { appState, authorizationDetails } = await request.auth0Client.completeInteractiveLogin<
			{ returnTo: string } | undefined
		>(new URL(request.url, options.appBaseUrl), { request, response });

		console.log('💬 ~ appState:', appState);
		console.log('💬 ~ authorizationDetails:', authorizationDetails);

		response.redirect(appState?.returnTo ?? options.appBaseUrl);
	});

	router.get('/auth/logout', async (request: Request, response: Response) => {
		const returnToParam = request.query['returnTo'];
		const requested = typeof returnToParam === 'string' ? returnToParam : undefined;

		const returnTo =
			requested && ALLOWED_ORIGINS.some((origin) => requested?.includes(origin))
				? requested
				: options.appBaseUrl;

		const logoutUrl = await request.auth0Client.logout(
			{ returnTo: returnTo.toString() },
			{ request, response },
		);

		response.redirect(logoutUrl.href);
	});

	return router;
}
