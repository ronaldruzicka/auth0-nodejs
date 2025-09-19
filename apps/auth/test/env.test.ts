import { test } from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../src/env.ts';

// Simple validation that schema loads required fields.
// (More exhaustive tests could mock process.env permutations.)

test('env contains required Auth0 variables', () => {
	assert.ok(env.AUTH0_CLIENT_ID);
	assert.ok(env.AUTH0_CLIENT_SECRET);
	assert.ok(env.AUTH0_DOMAIN);
	assert.ok(env.BASE_URL);
	assert.ok(env.SESSION_SECRET && env.SESSION_SECRET.length >= 32);
	assert.ok(env.DEV_PORT);
	assert.ok(env.PROD_PORT);
});
