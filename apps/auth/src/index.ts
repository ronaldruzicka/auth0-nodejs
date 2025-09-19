import express from 'express';
import { auth } from 'express-openid-connect';
import { env, resolvedPort } from './env.js';

const app = express();

// Basic health
app.get('/health', (_req, res) => {
	res.json({ status: 'ok', ts: Date.now() });
});

// Auth0 middleware configuration
app.use(
	auth({
		issuerBaseURL: `https://${env.AUTH0_DOMAIN}`,
		baseURL: env.BASE_URL,
		clientID: env.AUTH0_CLIENT_ID,
		secret: env.SESSION_SECRET,
		clientSecret: env.AUTH0_CLIENT_SECRET,
		idpLogout: true,
		authorizationParams: {
			scope: 'openid profile email',
		},
	}),
);

// Example protected route
app.get('/profile', (req, res) => {
	// express-openid-connect augments req with oidc helpers
	// @ts-ignore - ambient typing from the package (could extend later)
	if (!req.oidc?.isAuthenticated()) {
		return res.status(401).json({ error: 'unauthenticated' });
	}
	// @ts-ignore
	return res.json({ user: req.oidc.user });
});

const port = resolvedPort();
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Auth service listening on ${port} (env=${env.NODE_ENV ?? 'development'})`);
});
