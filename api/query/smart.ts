import { VercelRequest, VercelResponse } from '@vercel/node';
import Cache from '../_cache';
import { Err, Ok, config } from '../_utils';

const cache = new Cache();

export default async function(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // query is assumed to be base64 binary data
  let { chain, address, query } = req.query;
  if (Array.isArray(chain) || Array.isArray(address) || Array.isArray(query)) {
    return res.status(400).send('Bad Request');
  }

  const { chains } = await config();

  if (!chains[chain]) {
    return res.status(400).send('Unknown chain');
  }

  // optimize/compress payload if it's JSON
  try {
    const json = JSON.parse(Buffer.from(query, 'base64').toString());
    query = Buffer.from(JSON.stringify(json)).toString('base64');
  } catch {}

  const result = await cache.get(`${address}.${query}`, async () => {
    const rpc = chains[chain as string].rpc;
    const response = await fetch(`${rpc}/cosmwasm/wasm/v1/contract/${address}/smart/${query}`);
    if (!response.ok) {
      return Err({ status: response.status, message: await response.text()});
    } else {
      return Ok(await response.json());
    }
  });

  if (result.err) {
    return res.status(result.err.status).send(result.err.message);
  }
  return res.status(200).json(result.ok);
}
