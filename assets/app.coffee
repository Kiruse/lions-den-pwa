import '@/lib/firebase'
import './global.sass'

import * as vue from 'vue'
import Root from '@/views/root.vue'
import deferredPlugin from '@/lib/vue-deferred/plugin'

if navigator.serviceWorker
  try
    reg = await navigator.serviceWorker.register new URL('./sw.coffee', import.meta.url)
    console.log "Service Worker registered:", reg
  catch err
    console.error "Service Worker registration failed:", err
else
  console.log "Service Worker unavailable"

app = vue.createApp Root
app.use deferredPlugin
app.mount '#app'
