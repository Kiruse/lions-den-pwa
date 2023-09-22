import deferred from './composables'

export default
  install: (app, opts) ->
    app.mixin
      created: ->
        defs = @$options.deferred
        return unless defs?

        Object.entries(defs).forEach ([prop, value]) =>
          tmp = deferred.call @, value
          Object.defineProperty @, prop,
            get: -> tmp.value
