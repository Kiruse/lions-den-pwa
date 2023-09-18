import { subtle } from 'crypto';
import Cache from '../_cache';
import { Err, Ok, type Result, config } from '../_utils';

const cache = new Cache();

export default async function getSmartQuery(
  chain: string,
  address: string,
  query: any,
): Promise<Result<any, Error>> {
  const { chains } = await config();

  if (!chains[chain]) {
    return Err(new Error('Chain not found'));
  }

  const bytes = Buffer.from(JSON.stringify(query));
  const payload = bytes.toString('base64');
  const hash = Buffer.from(await subtle.digest('SHA-256', bytes)).toString('base64');

  return await cache.get(`${address}.${hash}`, async () => {
    const rpc = chains[chain as string].rpc;
    const response = await fetch(`${rpc}/cosmwasm/wasm/v1/contract/${address}/smart/${payload}`);
    if (!response.ok) {
      return Err({ status: response.status, message: await response.text()});
    } else {
      return Ok(await response.json());
    }
  });
}

export const getDaoMetadata = (address: string) =>
  getSmartQuery('terra', address, {dao_info: {}});
