import { CookieHandler, CookieSerializeOptions } from "@christies/auth0-server-js";
import { StoreOptions } from "../types.js";

const DOT_CHUNK_REGEX = new RegExp(/(.*)\.(\d+)$/);

function toUnderscoreForm(name: string): string {
  const [, base, index] = DOT_CHUNK_REGEX.exec(name) ?? [];

  if (base && index) {
    return `${base}__${index}`;
  }

  return name;
}

export class FastifyCookieHandler implements CookieHandler<StoreOptions> {
  setCookie(
    name: string,
    value: string,
    options?: CookieSerializeOptions,
    storeOptions?: StoreOptions,
  ): void {
    if (!storeOptions) {
      throw new Error("StoreOptions not provided");
    }

    const underscoreName = toUnderscoreForm(name);
    console.log("💬 ~ FastifyCookieHandler ~ setCookie ~ underscoreName:", underscoreName);

    storeOptions.reply.setCookie(underscoreName, value, options || {});
  }

  getCookie(name: string, storeOptions?: StoreOptions): string | undefined {
    if (!storeOptions) {
      throw new Error("StoreOptions not provided");
    }

    return storeOptions.request.cookies?.[name];
  }

  getCookies(storeOptions?: StoreOptions): Record<string, string> {
    if (!storeOptions) {
      throw new Error("StoreOptions not provided");
    }

    return storeOptions.request.cookies as Record<string, string>;
  }

  deleteCookie(name: string, storeOptions?: StoreOptions): void {
    if (!storeOptions) {
      throw new Error("StoreOptions not provided");
    }

    storeOptions.reply.clearCookie(name);
  }
}
