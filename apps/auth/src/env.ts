import { object, string, parse, minLength, optional, pipe } from 'valibot';

// Schema describing required environment variables.
// Adjust as your runtime logic evolves.
const EnvSchema = object({
	APP_BASE_URL: string(),
	AUTH0_CLIENT_ID: string(),
	AUTH0_CLIENT_SECRET: string(),
	AUTH0_DOMAIN: string(),
	AUTH0_SECRET: pipe(string(), minLength(32, 'AUTH0_SECRET should be at least 32 chars')),
	NODE_ENV: optional(string()),
});

// Perform validation once at startup.
const rawEnv: Record<string, string | undefined> = {
	APP_BASE_URL: process.env['APP_BASE_URL'],
	AUTH0_CLIENT_ID: process.env['AUTH0_CLIENT_ID'],
	AUTH0_CLIENT_SECRET: process.env['AUTH0_CLIENT_SECRET'],
	AUTH0_DOMAIN: process.env['AUTH0_DOMAIN'],
	AUTH0_SECRET: process.env['AUTH0_SECRET'],
	NODE_ENV: process.env['NODE_ENV'],
};

export const env = parse(EnvSchema, rawEnv);
