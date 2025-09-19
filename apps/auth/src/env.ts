import { object, string, parse, minLength, optional, pipe } from 'valibot';

// Schema describing required environment variables.
// Adjust as your runtime logic evolves.
const EnvSchema = object({
	AUTH0_CLIENT_ID: string(),
	AUTH0_CLIENT_SECRET: string(),
	AUTH0_DOMAIN: string(),
	BASE_URL: string(),
	DEV_PORT: string(),
	PROD_PORT: string(),
	SESSION_SECRET: pipe(string(), minLength(32, 'SESSION_SECRET should be at least 32 chars')),
	NODE_ENV: optional(string()),
});

// Perform validation once at startup.
const rawEnv: Record<string, string | undefined> = {
	DEV_PORT: process.env['DEV_PORT'],
	PROD_PORT: process.env['PROD_PORT'],
	BASE_URL: process.env['BASE_URL'],
	SESSION_SECRET: process.env['SESSION_SECRET'],
	AUTH0_DOMAIN: process.env['AUTH0_DOMAIN'],
	AUTH0_CLIENT_ID: process.env['AUTH0_CLIENT_ID'],
	AUTH0_CLIENT_SECRET: process.env['AUTH0_CLIENT_SECRET'],
	NODE_ENV: process.env['NODE_ENV'],
};

export const env = parse(EnvSchema, rawEnv);

export function resolvedPort() {
	return env.NODE_ENV === 'production' ? Number(env.PROD_PORT) : Number(env.DEV_PORT);
}
