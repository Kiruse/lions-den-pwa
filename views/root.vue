<template lang="pug">
.AppRoot: component(:is='routeComponent')
</template>

<script lang="coffee">
import { watch } from 'vue'
import useRoute from '@/stores/route'
import HomePage from '@/views/home.vue'
import NotFoundPage from '@/views/not-found.vue'

export default
  setup: -> useRoute()
  computed:
    routeComponent: ->
      switch @route
        when '', '/', '/home'
          HomePage
        else
          NotFoundPage
</script>
