import '../_firebase';

import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { VercelRequest, VercelResponse } from '@vercel/node';

import { cors, Err, isKnownJWTError, Ok, requireEnvar, Result } from '../_utils';

requireEnvar('ANON_SECRET');

export default async function(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!cors(req, res)) return;
  switch (req.method) {
    case 'GET':  return handleGet(req, res);
    case 'POST': return handlePost(req, res);
    default:
      return res.status(405).end('Method Not Allowed');
  }
}

async function handleGet(
  req: VercelRequest,
  res: VercelResponse,
) {
  const auth = getAuth();

  const { type } = req.query;

  switch (type) {
    case 'anonymous': {
      const uid = uuidv4();
      const idToken = signAnonToken(uid);
      const firebaseToken = await auth.createCustomToken(uid);
      return res.json({
        idToken,
        firebaseToken,
      });
    }
    default: {
      return res.status(400).end('Invalid login type');
    }
  }
}

async function handlePost(
  req: VercelRequest,
  res: VercelResponse,
) {
  const auth = getAuth();
  let token = req.headers.authorization;
  if (!token?.startsWith('Bearer ')) {
    return res.status(400).end('Invalid authorization header');
  }

  token = token.slice(7);

  const { ok: payload, err } = await new Promise<Result>(resolve => {
    jwt.verify(token!, process.env.ANON_SECRET!, (err: any, decoded: any) => {
      if (err) resolve(Err(err));
      resolve(Ok(decoded));
    });
  });

  if (err) {
    if (!isKnownJWTError(err))
      console.debug("JWT verification failed", err);
    else
      console.error("JWT verify error", err);
    return res.status(400).end('Invalid token');
  }

  const idToken = signAnonToken(payload.sub);
  const firebaseToken = await auth.createCustomToken(payload.sub);
  return res.status(200).json({
    idToken,
    firebaseToken,
  });
}

const signAnonToken = (uid: string) => jwt.sign({ sub: uid }, process.env.ANON_SECRET!, { expiresIn: '30d' });
