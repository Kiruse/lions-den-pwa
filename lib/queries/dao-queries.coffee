import BrowserCache from '../browser-cache'
import { config } from '../misc'
import requests from '../requests'

{daos} = config
cache = new BrowserCache 'queries'

export getDaoInfos = -> cache.get 'query/daos/meta', => requests.get '/query/daos/meta', api: 'home/v1'
export getDaoLogos = ->
  metas = await getDaoInfos()
  unless metas.ok
    console.warn 'Failed to get DAO logos', metas
    return {}
  Object.fromEntries(
    Object.entries(metas.ok).map ([name, meta]) => [name, meta?.logo?.url]
  )

export getProps = (dao) ->
  requests.get "/query/daos/props",
    api: 'home/v1'
    params:
      address: daos[dao]?.treasury
