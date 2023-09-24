import '@/lib/firebase'
import './global.sass'

import * as vue from 'vue'
import Root from '@/views/root.vue'
import deferredPlugin from '@/lib/vue-deferred/plugin'

app = vue.createApp Root
app.use deferredPlugin
app.mount '#app'
