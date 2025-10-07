import { CookieHandler, CookieSerializeOptions } from '@auth0/auth0-server-js';
import { StoreOptions } from '../types';

const DOT_CHUNK_REGEX = new RegExp(/(.*)\.(\d+)$/);

function toUnderscoreForm(name: string): string {
	const [, base, index] = DOT_CHUNK_REGEX.exec(name) ?? [];

	if (base && index) {
		return `${base}__${index}`;
	}

	return name;
}

export class ExpressCookieHandler implements CookieHandler<StoreOptions> {
	setCookie(
		name: string,
		value: string,
		options?: CookieSerializeOptions,
		storeOptions?: StoreOptions,
	): void {
		if (!storeOptions) {
			throw new Error('StoreOptions not provided');
		}

		// storeOptions.response.cookie(name, value, options || {});

		const underscoreName = toUnderscoreForm(name);
		console.log('💬 ~ ExpressCookieHandler ~ setCookie ~ underscoreName:', underscoreName);

		storeOptions.response.cookie(underscoreName, value, options || {});
	}

	getCookie(name: string, storeOptions?: StoreOptions): string | undefined {
		if (!storeOptions) {
			throw new Error('StoreOptions not provided');
		}

		return storeOptions.request.cookies[name];
	}

	getCookies(storeOptions?: StoreOptions): Record<string, string> {
		if (!storeOptions) {
			throw new Error('StoreOptions not provided');
		}

		return storeOptions.request.cookies;
	}

	deleteCookie(name: string, storeOptions?: StoreOptions): void {
		if (!storeOptions) {
			throw new Error('StoreOptions not provided');
		}

		storeOptions.response.clearCookie(name);
	}
}
