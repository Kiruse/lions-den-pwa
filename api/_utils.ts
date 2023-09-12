import { JsonWebTokenError } from "jsonwebtoken";

export function requireEnvar(name: string) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

export function isKnownJWTError(err: any) {
  if (!(err instanceof JsonWebTokenError)) return true;
  switch (err.message) {
    case 'jwt expired':
    case 'jwt malformed':
    case 'invalid token':
    case 'invalid signature':
      return false;
    default:
      return true;
  }
}

export type Result<T = any, E = any> = Ok<T> | Err<E>;

export type Ok<T> = { ok: T, err?: undefined };
export function Ok(): Ok<void>;
export function Ok<T>(value: T): Ok<T>;
export function Ok(ok?: any) {
  return { ok };
}

export type Err<E> = { ok?: undefined, err: E };
export function Err<E>(err: E): Err<E>;
export function Err(err?: any) {
  return { err };
}
