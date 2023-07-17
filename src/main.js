import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'


Vue.config.productionTip = false
Vue.use(Buefy)

const options = {}; //Options object to pass into SocketIO

// Vue.use(new VueSocketIO({
//     debug: true,
//     connection: SocketIO(process.env.VUE_APP_API+':3000', options), //options object is Optional
    
//   })
// );


new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')


