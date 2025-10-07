import { hkdf } from '@panva/hkdf';
import * as jose from 'jose';

const ENC = 'A256GCM';
const ALG = 'dir';
const DIGEST = 'sha256';
const BYTE_LENGTH = 32;
const ENCRYPTION_INFO = 'JWE CEK';

export async function encrypt(
	payload: jose.JWTPayload,
	secret: string,
	expiration: number,
	additionalHeaders?: {
		iat: number;
		uat: number;
		exp: number;
	},
) {
	const encryptionSecret = await hkdf(DIGEST, secret, '', ENCRYPTION_INFO, BYTE_LENGTH);

	const encryptedCookie = await new jose.EncryptJWT(payload)
		.setProtectedHeader({ enc: ENC, alg: ALG, ...additionalHeaders })
		.setExpirationTime(expiration)
		.encrypt(encryptionSecret);

	return encryptedCookie.toString();
}

export async function decrypt<T>(
	cookieValue: string,
	secret: string,
	options?: jose.JWTDecryptOptions,
) {
	try {
		const encryptionSecret = await hkdf(DIGEST, secret, '', ENCRYPTION_INFO, BYTE_LENGTH);

		const cookie = await jose.jwtDecrypt<T>(cookieValue, encryptionSecret, {
			...options,
			...{ clockTolerance: 15 },
		});

		return cookie;
	} catch (e: any) {
		if (e.code === 'ERR_JWT_EXPIRED') {
			return null;
		}
		throw e;
	}
}
