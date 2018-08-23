import Vue from 'vue'
import Vuex from 'vuex'

import App from '@/store/modules/App'
import Api from '@/store/modules/Api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    App,
    Api
  },
  // eslint-disable-next-line
  strict: process.env.NODE_ENV !== 'production'
})
