import { ref, watch } from 'vue'

export route = ref window.location.hash.slice(1)
export params = ref {}

watch route, (newRoute) ->
  window.location.hash = newRoute

window.addEventListener 'hashchange', ->
  unless route.value is window.location.hash.slice(1)
    route.value = window.location.hash.slice(1)
