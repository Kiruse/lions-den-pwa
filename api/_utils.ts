import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import { JsonWebTokenError } from 'jsonwebtoken';
import path from 'path';
import YAML from 'yaml';

export interface Config {
  chains: {
    [chain: string]: {
      name: string;
      chainId: string;
      rpc: string;
    };
  };
  daos: {
    [dao: string]: {
      type: 'token' | 'nft';
      name: string;
      treasury: string;
      token: string;
      distributor: string;
    };
  };
  tokens: Record<string, string>;
}

export function requireEnvar(name: string) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

let _config: Config | undefined;
export async function config(): Promise<Config> {
  if (!_config) {
    _config = await YAML.parse(await fs.readFile(path.join(__dirname, '../assets/config.yaml'), 'utf8'));
  }
  return _config!;
}

/**
 * Process CORS stuff & OPTIONS method.
 * @returns {boolean} true if the request should continue, false if it was handled.
 */
export function cors(req: VercelRequest, res: VercelResponse) {
  const { origin } = req.headers;

  if (origin && !isValidOrigin(origin)) {
    res.status(400).end();
    return false;
  }

  // if no origin, enforce same origin policy
  if (origin)
    res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    [
      'X-CSRF-Token',
      'X-Requested-With',
      'Accept',
      'Accept-Version',
      'Authorization',
      'Content-Length',
      'Content-MD5',
      'Content-Type',
      'Date',
      'X-Api-Version',
    ].join(', '),
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
