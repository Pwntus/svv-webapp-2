import { Auth, Logger } from 'aws-amplify'
import { MIC_USERNAME, MIC_PASSWORD } from '@/config'
import * as t from '@/store/types'

const logger = new Logger('StoreApp')

const state = {
  inited: false,
  user: null
}

const mutations = {
  [t.APP_CLEAN] (state) {
    state.user = null
  },
  [t.APP_SET_USER] (state, user) {
    state.user = user
  },
  [t.APP_SET_INITED] (state, value) {
    state.inited = value
  }
}

const actions = {
  /* Init app by checking if user is authenticated,
   * and authenticate if not.
   */
  async init ({ commit, dispatch }) {
    try {
      await Auth.currentAuthenticatedUser()
      commit(t.APP_SET_USER, await Auth.currentUserInfo())
      commit(t.APP_SET_INITED, true)

    // Not authenticated
    } catch (e) {
      await dispatch('authenticate')
    }
  },

  /* Authenticate a user.
   */
  async authenticate ({ commit }) {
    try {
      await Auth.signIn(MIC_USERNAME, MIC_PASSWORD)
      commit(t.APP_SET_USER, await Auth.currentUserInfo())
      commit(t.APP_SET_INITED, true)

    // Authentication failed, app cannot start
    } catch (e) {
      logger.error('could not authorize', e)
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
