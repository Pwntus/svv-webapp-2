import { Logger } from 'aws-amplify'
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
          query: { bool: {
            must: [ { range: { 'state.tcxn.connection_status': { gt: 1 } } } ],
            filter: { term: { thingType: MIC_THING_TYPE } } } }
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

const getters = {
  things: (state) => {
    return state.things
  },
  mapThings: (state) => {
    // Debug Things
    let things = JSON.parse(JSON.stringify(state.things))
    things.push({
      thingName: '000042',
      state: {
        tmp: 42,
        hum: 13,
        pos: '69.263644,20.573962'
      }
    })
    things.push({
      thingName: '000043',
      state: {
        tmp: 43,
        hum: 14,
        pos: '69.252629,20.589964'
      }
    })
    things.push({
      thingName: '000044',
      state: {
        tmp: -10,
        hum: 10,
        pos: '69.374330,20.293395'
      }
    })
    things.push({
      thingName: '000044',
      state: {
        tmp: -15,
        hum: 5,
        pos: '69.114180,20.749384'
      }
    })

    return things.map(thing => {
      return {
        thingName: thing.thingName,
        label: thing.label,
        state: thing.state
      }
    }).filter(thing => typeof thing.state !== 'undefined')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
