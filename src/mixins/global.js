import Vue from 'vue'
import { mapGetters } from 'vuex'

const eventBus = new Vue()

Vue.mixin({
  data: () => ({
    eventBus
  }),
  computed: {
    ...mapGetters({
      ApiMapThings: 'Api/mapThings'
    })
  },
  methods: {
    handleError (e) {
      const { message } = e
      this.eventBus.$emit('ui:snackbar', { message })
    }
  }
})
