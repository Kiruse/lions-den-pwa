import * as vue from 'vue'
import Root from '@/views/root.vue'
import '@/lib/firebase'
import './global.sass'

app = vue.createApp Root
app.mount '#app'
