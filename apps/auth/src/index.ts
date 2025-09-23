import cors from 'cors';
import express from 'express';
import { auth, ConfigParams, requiresAuth } from 'express-openid-connect';
import helmet from 'helmet';
import { env, resolvedPort } from './env.ts';

const config = {
	baseURL: env.BASE_URL, // e.g. http://localhost:4040
	clientID: env.AUTH0_CLIENT_ID,
	clientSecret: env.AUTH0_CLIENT_SECRET,
	issuerBaseURL: `https://${env.AUTH0_DOMAIN}`,
	secret: env.SESSION_SECRET,

	authRequired: false, // we will protect specific routes with requiresAuth()
	auth0Logout: true,

	// Adjust session cookie so it can be sent in cross-origin fetch calls from SPA origins.
	session: {
		rolling: true,
		absoluteDuration: 60 * 60 * 8, // 8 hours
		cookie: {
			sameSite: 'Lax',
			// In production you MUST use HTTPS and secure: true.
			secure: process.env['NODE_ENV'] !== 'development',
		},
	},
	routes: {
		login: false, // we will handle login manually to set returnTo dynamically
		postLogoutRedirect: 'http://localhost:5173',
	},
} satisfies ConfigParams;

const app = express();

app.use(helmet());

const CLIENT_APP = 'http://localhost:5173';

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
);

// Auth0 middleware configuration
app.use(auth(config));

app.get('/', (req, res) => {
	return res.json({ authenticated: req.oidc.isAuthenticated(), user: req.oidc.user || null });
});

// Session introspection endpoint used by the React client to determine auth state.
app.get('/session', (req, res) => {
	res.json({ authenticated: req.oidc.isAuthenticated(), user: req.oidc.user || null });
});

// Returns the full user profile (protected)
app.get('/profile', requiresAuth(), (req, res) => {
	res.json({ user: req.oidc.user });
});

app.get('/login', (req, res) => {
	return res.oidc.login({
		// After successful auth, send user back to the Vite app
		returnTo: 'http://localhost:5173',
	});
});

const port = resolvedPort();

app.listen(port, () => {
	console.log(`Auth service listening on ${port} (env=${env.NODE_ENV ?? 'development'})`);
});
