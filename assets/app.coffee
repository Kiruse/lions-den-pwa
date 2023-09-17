import '@/lib/firebase'
import './global.sass'

import * as vue from 'vue'
import Root from '@/views/root.vue'

app = vue.createApp Root
app.mount '#app'
