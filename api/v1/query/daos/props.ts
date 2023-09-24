import { VercelRequest, VercelResponse } from '@vercel/node';
import { config, cors } from '../../../_utils';
import { getDaoProps } from '../_smart-query';

export default async function(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!cors(req, res)) return;
  const { daos } = await config();
  const q = req.query as any;
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
