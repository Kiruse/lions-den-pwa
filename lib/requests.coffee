APIURL = process.env.APIURL.replace /\/+$/, ''

export default request = (opts) ->
  {
    type = 'json',
    expects = 'json',
    method,
    api,
    url,
    headers = {},
    body,
    params = {},
  } = opts

  switch api
    when 'home' then url = "#{APIURL}/#{url.replace(/^\/+/, '')}"

  if not headers['Authorization'] and global.token
    headers['Authorization'] = "Bearer #{global.token}"

  sparams = Object
    .entries params
    .map ([k, v]) -> "#{encodeURIComponent k}=#{encodeURIComponent v}"
    .join '&'
  url = "#{url}?#{sparams}" if sparams

  res = await fetch url,
    method: method
    headers: {
      ...headers
      'Content-Type': switch type
        when 'json' then 'application/json'
        else 'text/plain'
    }
    body: switch type
      when 'json' then JSON.stringify body
      else body
  return res if expects in ['response', 'raw']
  return await Err(res) unless res.ok

  responseType = res.headers.get('Content-Type') or 'text/plain'
  responseType = responseType.split(';')[0] or 'text/plain'

  switch responseType
    when 'text/plain'
      if expects and expects isnt 'text'
        return await Err res, "Expected #{expects} but got text"
      return await Ok res, await res.text()
    when 'application/json'
      if expects and expects isnt 'json'
        return await Err res, "Expected #{expects} but got json"
      return await Ok res, await res.json()
    else
      return await Err res, "Unknown response type #{responseType}"

request.get  = (url, opts) => request { method: 'GET',    url, ...opts }
request.post = (url, opts) => request { method: 'POST',   url, ...opts }
request.put  = (url, opts) => request { method: 'PUT',    url, ...opts }
request.del  = (url, opts) => request { method: 'DELETE', url, ...opts }

Ok = (res, data) =>
  ok: data
  response: res
Err = (res, msg) =>
  err: msg or await res.text() or res.statusText
  response: res
