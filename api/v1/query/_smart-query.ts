import '../../_firebase';

import { subtle } from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';

import Cache from '../../_cache';
import { InData, ProposalsQueryResponse, fromProposalQueryResponse } from '../_common';
import { config, Err, Ok, Result } from '../../_utils';

const cache = new Cache();

export default async function getSmartQuery<T = any>(
  chain: string,
  address: string,
  query: any,
  expires?: number,
): Promise<Result<T, Error>> {
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
  }, expires);
}

export const getDaoMetadata = (address: string) =>
  getSmartQuery('terra', address, {dao_info: {}});

export async function getDaoProps(address: string, page: number, pageSize: number) {
  await updateProps(address);
  const db = getFirestore();
  const coll = db.collection(`daos/${address}/props`);
  const docs = await coll.orderBy('id', 'desc').offset(page * pageSize).limit(pageSize).get();
  return docs.docs.map(doc => doc.data());
}

async function updateProps(address: string) {
  const db = getFirestore();
  const coll = db.collection(`daos/${address}/props`);
  const {docs} = await coll.orderBy('id', 'desc').limit(1).get();

  let lastId = -1;
  if (docs.length) {
    lastId = docs[0].get('id');
  }

  const promises: Promise<any>[] = [];
  const limit = 50;
  let more = true;
  do {
    const filter = lastId >= 0 ? {
      start_after: lastId,
      limit,
    } : {};
    const result = await getSmartQuery<InData<ProposalsQueryResponse>>('terra', address, { proposals: filter });

    if (result.ok) {
      const _props = result.ok.data?.proposals ?? [];
      more = _props.length === limit;

      // defer writing props to firestore
      const props = _props.map(fromProposalQueryResponse);
      promises.push(...props.map(async prop => {
        await coll.doc(prop.id.toString()).set(prop);
      }));
      lastId = Math.max(...props.map(prop => prop.id));
    }
    else {
      console.warn(`Failed to fetch proposals after ${lastId} for ${address}:`, result.err);
      more = false;
    }
  } while (more);

  // wait for all props to be written
  await Promise.all(promises);
}
