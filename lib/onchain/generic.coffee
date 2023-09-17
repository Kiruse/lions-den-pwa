import request from '@/lib/requests'
import BrowserCache from '@/lib/browser-cache'
import { parseExpires } from '../misc'

CACHE = new BrowserCache 'queries'

getCacheKey = (address, query) ->
  "#{address}." + Buffer.from(await crypto.subtle.digest('SHA-256', Uint8Array.from(query))).toString('base64')

export getSmartQuery = (address, query, expires = 0) ->
  query = Buffer.from(JSON.stringify(query), 'utf8').toString('base64')
  expires = parseExpires expires

  execute = ->
    res = await request.get "/query/smart",
      api: 'home'
      expects: 'json'
      params: { chain: 'terra', address, query }
    return res if res.err
    { data } = res.ok or {}
    return data

  if expires > 0
    cacheKey = await getCacheKey address, query
    await CACHE.get cacheKey, execute, expires
  else
    await execute()
