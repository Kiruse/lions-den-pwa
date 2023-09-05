###*
# Used to cache a stats object for the virtual file.
# Extracted from the `mock-fs` package.
# Ported to CoffeeScript by Kiruse, because I love CoffeeScript, even tho it's JS's retarded cousin.
#
# @author Tim Schaub http://tschaub.net/
# @author Kiruse https://github.com/kiruse
# @link https://github.com/tschaub/mock-fs/blob/master/lib/binding.js
# @link https://github.com/tschaub/mock-fs/blob/master/license.md
###

constants = require 'constants'

module.exports = class VirtualStats
  constructor: (config) ->
    for key, value of config
      continue unless config.hasOwnProperty key
      @[key] = value

  _checkModeProperty: (property) -> (@mode & constants.S_IFMT) is property

  isDirectory: -> @_checkModeProperty constants.S_IFDIR
  isFile: -> @_checkModeProperty constants.S_IFREG
  isBlockDevice: -> @_checkModeProperty constants.S_IFBLK
  isCharacterDevice: -> @_checkModeProperty constants.S_IFCHR
  isSymbolicLink: -> @_checkModeProperty constants.S_IFLNK
  isFIFO: -> @_checkModeProperty constants.S_IFIFO
  isSocket: -> @_checkModeProperty constants.S_IFSOCK
