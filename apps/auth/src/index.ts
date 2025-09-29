import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyAuth0, { ALLOWED_ORIGINS, getReturnTo } from './auth0.js';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';

const fastify = Fastify({
	logger: false,
});

fastify.register(cors, {
	origin: ALLOWED_ORIGINS,
	credentials: true,
});

fastify.register(fastifyCookie);

fastify.register(fastifyAuth0, {
	domain: process.env.AUTH0_DOMAIN as string,
	clientId: process.env.AUTH0_CLIENT_ID as string,
	clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
	appBaseUrl: process.env.BASE_URL as string,
	sessionSecret: process.env.SESSION_SECRET as string,
});

fastify.get('/', async (request, reply) => {
	const user = await fastify.auth0Client!.getUser({ request, reply });

	// return reply.viewAsync('index.ejs', { isLoggedIn: !!user, user: user });
	return { isLoggedIn: !!user, user };
});

fastify.get('/public', async (request, reply) => {
	const user = await fastify.auth0Client!.getUser({ request, reply });

	return { isLoggedIn: !!user, user };
});

async function hasSessionPreHandler(request: FastifyRequest<QueryParams>, reply: FastifyReply) {
	const session = await fastify.auth0Client!.getSession({ request, reply });

	if (!session) {
		const returnTo = getReturnTo(request, { appBaseUrl: process.env.BASE_URL });

		reply.redirect(`/auth/login?returnTo=${returnTo}`);
	}
}

fastify.get(
	'/private',
	{
		preHandler: hasSessionPreHandler,
	},
	async (request, reply) => {
		const user = await fastify.auth0Client!.getUser({ request, reply });

		return {
			isLoggedIn: !!user,
			user,
		};
	},
);

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
