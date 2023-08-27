<template lang="pug">
#omega.AppRoot
  NavBar
  component.AppRoot-content(:is='routeComponent')
</template>

<script lang="coffee">
import { watch } from 'vue'
import useRoute from '@/stores/route'
import NavBar from '@/comp/navbar'
import HomePage from '@/views/home.vue'
import NotFoundPage from '@/views/not-found.vue'

export default
  components: { NavBar }
  setup: -> useRoute()
  computed:
    routeComponent: ->
      switch @route
        when '', '/', '/home'
          HomePage
        else
          NotFoundPage
</script>

<style lang="sass">
.AppRoot-content
  flex: 1
</style>
