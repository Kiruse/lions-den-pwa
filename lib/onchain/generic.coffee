import request from '@/lib/requests'

export getSmartQuery = (address, query) ->
  query = Buffer.from(JSON.stringify(query), 'utf8').toString('base64')
  res = await request.get "/query/smart",
    api: 'home'
    expects: 'json'
    params: { chain: 'terra', address, query }
  return res if res.err
  { data } = res.ok or {}
  return data
