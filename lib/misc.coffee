import config from '@/assets/config.yaml'

# inject ID into DAO metadata for easier access later
Object.entries(config.daos).forEach ([id, meta]) => meta.id = id
export { config }

export zip = (arys...) =>
  len = Math.max arys.map((a) => a.length)...
  result = new Array len
  for i in [0...len]
    result[i] = arys.map (a) => a[i]
  result

export addr = (addr) =>
  bechPrefix = addr.slice 0, addr.indexOf '1'
  addr = if /^[a-z]+$/.test bechPrefix
    addr.slice addr.indexOf('1') + 1
  else
    bechPrefix = ''
    addr
  bechPrefix + '1' + addr.slice(0, 6) + '...' + addr.slice(-6)

export parseExpires = (expires) ->
  if typeof expires is 'string'
    switch
      when expires.match /^\d+d$/
        tmp = parseInt expires
        tmp *= 24 * 60 * 60 * 1000
      when expires.match /^\d+h$/
        tmp = parseInt expires
        tmp *= 60 * 60 * 1000
      when expires.match /^\d+m$/
        tmp = parseInt expires
        tmp *= 60 * 1000
      when expires.match /^\d+s$/
        tmp = parseInt expires
        tmp *= 1000
      when expires.match /^\d+ms$/
        tmp = parseInt expires
      else
        throw new Error "Invalid expires format: #{expires}"
  else if typeof expires is 'number'
    return expires

export getDaoByAddress = (addr) =>
  Object.values config.daos
    .find (meta) => meta.treasury is addr
