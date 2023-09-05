<template lang="pug">
component.Router-root(:is='routeComponent')
</template>

<script lang="coffee">
import routes from '@routes'
import useRoute from '@/hooks/route'
import NotFound from '@/views/not-found'

export default
  setup: ->
    console.log routes
    useRoute()
  computed:
    routeComponent: ->
      route = @route?.replace(/\/index/, '/') || '/'
      routes[route] || NotFound
</script>
