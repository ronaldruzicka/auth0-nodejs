// Minimal type augmentation for express-openid-connect to satisfy TypeScript in this service.
import 'express-openid-connect';
import type { Request } from 'express';

declare module 'express-openid-connect' {
	interface OpenidRequest extends Request {
		// Intentionally partial; expand with stricter typing as needed.
	}
}

declare module 'express-serve-static-core' {
	interface Request {
		// Basic shape asserted at runtime by middleware
		oidc?: {
			isAuthenticated: () => boolean;
			user?: Record<string, unknown>;
		};
	}
}
