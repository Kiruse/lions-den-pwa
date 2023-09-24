import { VercelRequest, VercelResponse } from '@vercel/node';
import { config, cors } from '../../../_utils';
import { getDaoMetadata } from '../_smart-query';

export default async function(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!cors(req, res)) return;
  const cfg = await config();

  // DAOs are currently only on Terra/Enterprise
  const logos = Object.fromEntries(await Promise.all(
    Object.entries(cfg.daos).map(async ([dao, info]) => {
      const meta = await getDaoMetadata(info.treasury);
      return [dao, meta.ok?.data?.metadata || undefined];
    }),
  ));

  return res.json(logos);
}
