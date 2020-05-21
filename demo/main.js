import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import PicViewer from '../src/main'
//todo: import PicViewer from 'pic-viewer'
Vue.use(PicViewer)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
