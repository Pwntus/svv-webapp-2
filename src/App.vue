<template lang="pug">
v-app
  ui-snackbar
  v-content
    v-container(fluid)
      router-view
</template>

<script>
import UiSnackbar from '@/components/ui/Snackbar'

export default {
  name: 'App',
  components: { UiSnackbar },
  async mounted () {
    await this.$store.dispatch('App/init')

    try {
      await this.$store.dispatch('Api/getThings')
    } catch (e) {
      this.handleError(e)
    }
  }
}
</script>

<style lang="stylus">
html
  overflow-y auto !important

#app
  font-family "Hind Vadodara", "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
