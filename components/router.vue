<template lang="pug">
component.Router-root(:is='routeComponent')
</template>

<script lang="coffee">
import routes from '@routes'
import { route, params } from '@/hooks/route'
import { zip } from '@/lib/misc'
import NotFound from '@/views/not-found'

matchRoute = (routeParts, refRoute) ->
  refRouteParts = refRoute.split '/'
  return null if routeParts.length != refRouteParts.length

  matches = {}
  parts = zip routeParts, refRouteParts
  for [part, refPart] in parts
    if part is refPart
      continue
    else if refPart[0] is ':'
      matches[refPart.slice 1] = part
    else
      return null
  return matches

export default
  setup: -> { route, params }
  data: ->
    routeComponent: NotFound
  watch:
    route:
      handler: ->
        @routeComponent = routes[@route or '/'] or NotFound
        @params = {}

        # simple case: param-less direct route
        return if routes[@route]

        # complex case: parameterized routes
        pathparts = @route.split '/'
        for _route, component of routes
          if matches = matchRoute pathparts, _route
            @routeComponent = component
            @params = matches
      immediate: true
</script>
