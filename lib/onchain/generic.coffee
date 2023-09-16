import request from '@/lib/requests'

export getSmartQuery = (address, query) ->
  query = Buffer.from(JSON.stringify(query), 'utf8').toString('base64')
  res = await request.get "/cosmwasm/wasm/v1/contract/#{address}/smart/#{query}",
    api: 'rpc:terra'
    expects: 'json'
  return res if res.err
  { data } = res.ok or {}
  return data
