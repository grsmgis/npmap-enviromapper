import Vue from 'vue'
import App from './App.vue'
import Header from './components/Header.vue'
import Multiselect from 'vue-multiselect'
import axios from 'axios'

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
Vue.prototype.$http = window.axios

Vue.config.productionTip = false
Vue.component('multiselect', Multiselect)

new Vue({
  render: h => h(App)
}).$mount('#app')

/* 
  this is a temporary, quick, and dirty solution 
  until more of the HTML is converted to Vue.js
*/
new Vue({
  render: h => h(Header)
}).$mount('#header')