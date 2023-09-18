import BrowserCache from '../browser-cache'
import requests from '../requests'

cache = new BrowserCache 'queries'

export getDaoInfos = -> cache.get 'dao-infos', => requests.get '/query/dao-infos', api: 'home'
export getDaoLogos = ->
  metas = await getDaoInfos()
  unless metas.ok
    console.warn 'Failed to get DAO logos', metas
    return {}
  Object.fromEntries(
    Object.entries(metas.ok).map ([name, meta]) => [name, meta?.logo?.url]
  )
