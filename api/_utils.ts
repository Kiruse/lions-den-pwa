import { VercelRequest, VercelResponse } from "@vercel/node";
import { JsonWebTokenError } from "jsonwebtoken";

export function requireEnvar(name: string) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

/**
 * Process CORS stuff & OPTIONS method.
 * @returns {boolean} true if the request should continue, false if it was handled.
 */
export function cors(req: VercelRequest, res: VercelResponse) {
  const { origin } = req.headers;

  if (!isValidOrigin(origin)) {
    res.status(400).end();
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  return true;
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

function isValidOrigin(origin: string | undefined | null): origin is string {
  if (!origin || origin === 'null') return false;

  const STATIC_HOSTS = [
    'https://lions-den-pwa.vercel.app/',
    'https://den.liondao.money/',
  ];

  if (STATIC_HOSTS.includes(origin)) return true;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}
