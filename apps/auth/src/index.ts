import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import fastifyAuth0 from './auth0.js';

const fastify = Fastify({
	logger: false,
});

fastify.register(fastifyCookie);

await fastify.register(cors, {
	origin: ['http://localhost:3000'],
	credentials: true,
});

fastify.register(fastifyAuth0, {
	appBaseUrl: process.env.APP_BASE_URL as string,
	clientId: process.env.AUTH0_CLIENT_ID as string,
	clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
	domain: process.env.AUTH0_DOMAIN as string,
	sessionSecret: process.env.AUTH0_SECRET as string,
});

fastify.get('/', async (request, reply) => {
	const user = await fastify.auth0Client!.getUser({ request, reply });

	return reply.send({ isLoggedIn: !!user, user: user });
});

fastify.get('/auth/session', async (request, reply) => {
	const session = await fastify.auth0Client!.getSession({ request, reply });

	return reply.send({ session });
});

const start = async () => {
	try {
		await fastify.listen({ port: 3003 });
		console.log('Server listening on http://localhost:3003');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
