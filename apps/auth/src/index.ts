import type { Request, Response } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env, resolvedPort } from './env.ts';
import { ALLOWED_ORIGINS, auth0, Auth0ExpressOptions } from './auth0.ts';
import { hasSession } from './utils/has-session.ts';

const config = {
	appBaseUrl: env.BASE_URL, // e.g. http://localhost:4040
	clientId: env.AUTH0_CLIENT_ID,
	clientSecret: env.AUTH0_CLIENT_SECRET,
	domain: env.AUTH0_DOMAIN,
	sessionSecret: env.SESSION_SECRET,
} satisfies Auth0ExpressOptions;

const app = express();
const port = resolvedPort();

app.listen(port, () => {
	console.log(`Auth service listening on ${port} (env=${env.NODE_ENV ?? 'development'})`);
});

app.use(helmet());

app.use(
	cors({
		origin: ALLOWED_ORIGINS,
		credentials: true,
	}),
);

app.use(cookieParser());

// Auth0 middleware configuration
app.use(auth0(config));

const router = new express.Router();

router.get('/', async (request: Request, response: Response) => {
	const user = await request.auth0Client.getUser({
		request,
		response,
	});

	return response.json({ isLoggedIn: !!user, user: user });
});

router.get('/public', async (request: Request, response: Response) => {
	const user = await request.auth0Client.getUser({
		request,
		response,
	});

	return response.json({
		isLoggedIn: !!user,
		user,
	});
});

router.get('/private', hasSession, async (request: Request, response: Response) => {
	const user = await request.auth0Client.getUser({
		request,
		response,
	});

	return response.json({
		isLoggedIn: !!user,
		user,
	});
});

app.use(router);
