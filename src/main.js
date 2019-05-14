import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 自定义组件
import Seat from '@/views/Seat'
Vue.component('seat', Seat)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
