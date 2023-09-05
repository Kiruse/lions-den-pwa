# code derived from https://github.com/webpack/webpack/blob/main/lib/RawModule.js
fs = require 'fs/promises'
path = require 'path'
{Module, RuntimeGlobals} = require 'webpack'

PLUGIN_NAME = 'RoutesPlugin'
PAGESPATH = path.resolve __dirname, '../../pages'
VIRTUAL_ROUTES_PATH = path.join __dirname, '__virtual__', 'routes.js'

###*
# A fake [`CacheBackend`](https://github.com/webpack/enhanced-resolve/blob/3a28f47788de794d9da4d1702a3a583d8422cd48/lib/CachedInputFileSystem.js#L154)
# decay level to prevent virtual files from decaying.
# @type {Set<string>}
###
FAKE_CACHED_BACKEND_LEVEL = new Set()

getRoutes = ->
  ###* @type {Set<string>} ###
  result = new Set()
  ###* @param {string} dir ###
  callback = (dir) =>
    entries = await fs.readdir dir, withFileTypes: true
    files   = entries.filter((file) => !file.isDirectory()).map((file) => file.name)
    dirs    = entries.filter((dir) => dir.isDirectory()).map((dir) => dir.name)

    for file in files
      result.add path.join(dir, file) if file.endsWith('.vue')
    await Promise.all dirs.map (subdir) => callback(path.join(dir, subdir))
  await callback PAGESPATH
  return [result...].sort()

generateSource = (routes) ->
  routes = [new Set(routes)...].sort()
  relroutes = routes
    .map (route) => '/' + path.relative PAGESPATH, route
    .filter (route) => not route.startsWith '/../'
    .filter (route) => route.endsWith '.vue'
    .filter (route) => not /\/_/.test route
    # special case for /index.vue (root route)
    .map (route) => route.replace /^\/index.vue$/, '/'
    # remove .vue suffix
    # reroute /**/index.vue to /**/
    .map (route) => route.replace /(\/index)?\.vue$/, ''

  return [
    routes.map((route, i) => "import __route#{i} from #{JSON.stringify route};")...
    ''
    'export default {'
    relroutes.map((route, i) => "  #{JSON.stringify route}: __route#{i},")...
    '}'
  ].join '\n'

###*
# @param {*} fs
# @param {string} filepath
# @param {string} contents
###
writeVirtualFile = (compiler, filepath, contents) =>
  # see https://github.com/webpack/enhanced-resolve/blob/3a28f47788de794d9da4d1702a3a583d8422cd48/lib/CachedInputFileSystem.js
  # the backend is specific to the different file system methods. its _data stores the respective
  # contents. for `_readFileBackend`, this is `Buffer | string`. for `_statBackend`, this is a `Stats`.
  # the `CacheBackend` uses multi-level caching, so to prevent the file from decaying we need to
  # fake the `level` property.
  compiler.inputFileSystem._readFileBackend._data.set filepath,
    err: null
    result: contents
    level: FAKE_CACHED_BACKEND_LEVEL

module.exports = class RoutesPlugin
  ###* @param {import('webpack').Compiler} compiler ###
  apply: (compiler) ->
    @compiler = compiler
    compiler.hooks.beforeCompile.tapPromise PLUGIN_NAME, @hookBeforeCompile.bind(@)
    # TODO: optimize rebuilds by only rebuilding @routes when a pages/ file changes
    # compiler.hooks.watchRun.tapPromise PLUGIN_NAME, @hookWatchRun.bind(@)

    compiler.resolverFactory.hooks.resolver.for('normal').tap PLUGIN_NAME, (resolver) =>
      resolver.hooks.resolve.tap PLUGIN_NAME, (req, ctx) =>
        if req.request is '@routes'
          req.path = VIRTUAL_ROUTES_PATH
        req

  hookBeforeCompile: ->
    routes = await getRoutes()
    writeVirtualFile @compiler, VIRTUAL_ROUTES_PATH, generateSource(routes)
