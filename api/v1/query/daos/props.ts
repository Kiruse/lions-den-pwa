import { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../../_utils';
import { getDaoProp, getDaoProps } from '../_smart-query';

export default async function(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!cors(req, res)) return;

  if ('id' in req.query) {
    return await handleQuerySingle(req, res);
  } else {
    return await handleQueryList(req, res);
  }
}

async function handleQueryList(
  req: VercelRequest,
  res: VercelResponse,
) {
  const q = req.query as Record<string, string>;
  const { address } = q;
  const page = parseInt(q.page || '0');
  const pageSize = parseInt(q.pageSize || '10');

  if (!address)
    return res.status(400).end('Invalid address parameter');
  if (isNaN(page) || page < 0)
    return res.status(400).end('Invalid page parameter');
  if (isNaN(pageSize) || pageSize < 0)
    return res.status(400).end('Invalid pageSize parameter');

  const props = await getDaoProps(address, page, pageSize);
  res.json(props);
}

async function handleQuerySingle(
  req: VercelRequest,
  res: VercelResponse,
) {
  const q = req.query as Record<string, string>;
  const { address } = q;
  const id = parseInt(q.id);

  if (!address)
    return res.status(400).end('Invalid address parameter');
  if (!id || isNaN(id) || id < 0)
    return res.status(400).end('Invalid id parameter');

  const prop = await getDaoProp(address, id);
  res.json(prop);
}
