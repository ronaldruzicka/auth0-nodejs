import { JWTPayload } from "jose";
import { decrypt, encrypt } from "../encryption/index.js";
import type { AbstractDataStore, EncryptedStoreOptions } from "../types.js";

/**
 * Abstract class that can be used to implement an Encrypted JWT State Store, using the 'A256CBC-HS512' encryption algorithm.
 */
export abstract class AbstractStore<TData extends JWTPayload, TStoreOptions = unknown>
  implements AbstractDataStore<TData, TStoreOptions>
{
  protected readonly options: EncryptedStoreOptions;

  constructor(options: EncryptedStoreOptions) {
    this.options = options;
  }

  abstract set(
    identifier: string,
    state: TData,
    removeIfExists?: boolean,
    options?: TStoreOptions | undefined,
  ): Promise<void>;
  abstract get(identifier: string, options?: TStoreOptions | undefined): Promise<TData | undefined>;
  abstract delete(identifier: string, options?: TStoreOptions | undefined): Promise<void>;

  protected async encrypt<TData extends JWTPayload>(stateData: TData, expiration: number) {
    return await encrypt(stateData, this.options.secret, expiration);
  }

  protected async decrypt<TData>(encryptedStateData: string) {
    return (await decrypt(encryptedStateData, this.options.secret)) as TData;
  }
}
