import { Logger } from 'aws-amplify'
import * as _ from 'lodash'
import { MIC_THING_TYPE } from '@/config'
import * as t from '@/store/types'
import Api from '@/lib/api'

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
  },
  [t.API_SET_THING_SHADOW] (state, thing) {
    try {
      const { thingName, shadow } = thing
      let t = state.things.find(thing => thing.thingName === thingName)
      t.shadow = shadow
      state.things = _.cloneDeep(state.things)
    } catch (e) {}
  }
}

const actions = {
  /* Get all Things under a specified Thing Type ID,
   * and store them on the store.
   */
  async getThings ({ commit, dispatch }) {
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
      dispatch('getThingsShadows')
    } catch (e) {
      logger.error('could not fetch Things', e)
      throw e
    }
  },

  /* Load shadow of Things.
   */
  async getThingsShadows ({ commit, getters }) {
    for (let thing of getters.things) {
      const { thingName, thingType } = thing

      try {
        commit(t.API_SET_THING_SHADOW, await Api.get('/things', { thingName, thingType }))
      } catch (e) {
        logger.error('could not fetch Thing shadows', e)
        throw e
      }
    }
  }
}

const getters = {
  things: (state) => {
    return state.things
  },
  mapThings: (state) => {
    return state.things.map(thing => {
      return {
        thingName: thing.thingName,
        label: thing.label,
        shadow: thing.shadow
      }
    }).filter(thing => typeof thing.shadow !== 'undefined')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
