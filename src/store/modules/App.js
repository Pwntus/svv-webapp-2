import * as t from '@/store/types'

const state = {
  inited: false,
  user: null
}

const mutations = {
  [t.APP_CLEAN] (state) {
    state.user = null
    state.drawer = []
  }
}

const actions = {
  /* Init app by logging in using Cognito.
   */
  async init () {
    try {

    } catch (e) {

    }
  }
}

const getters = {
  inited: (state) => {
    return state.inited
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
