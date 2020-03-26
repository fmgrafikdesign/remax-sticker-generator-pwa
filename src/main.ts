import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import App from './App.vue'
import './registerServiceWorker'
import './assets/main.css'

Vue.use(VueNoty, {
  layout: 'topCenter',
  theme: 'metroui',
  timeout: 3000
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
