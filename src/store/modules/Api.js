import * as t from '@/store/types'
import { Logger } from 'aws-amplify'
import Api from '@/lib/api'
import { MIC_THING_TYPE } from '@/config'

const logger = new Logger('StoreApi')

const state = {
  things: []
}

const mutations = {
  [t.API_CLEAN] (state) {
    state.things = []
  },
  [t.API_SET_THINGS] (state, things) {
    state.things = things
  }
}

const actions = {
  /* Get all Things under a specified Thing Type ID,
   * and store them on the store.
   */
  async getThings ({ commit }) {
    try {
      const body = {
        query: {
          size: 1000,
          from: 0,
          query: { bool: { filter: { term: { thingType: MIC_THING_TYPE } } } }
        }
      }
      const result = await Api.post('/things/find', body)
      const filtered = result.hits.hits.map(hit => hit._source)
      commit(t.API_SET_THINGS, filtered)
    } catch (e) {
      logger.error('could not fetch Things', e)
      throw e
    }
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
