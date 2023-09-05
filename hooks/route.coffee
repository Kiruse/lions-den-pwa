import { ref, watch } from 'vue'

route = ref window.location.hash.slice(1)

watch route, (newRoute) ->
  window.location.hash = newRoute

window.addEventListener 'hashchange', ->
  unless route.value is window.location.hash.slice(1)
    route.value = window.location.hash.slice(1)

export default useRoute = -> { route }
