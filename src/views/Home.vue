<template lang="pug">
#view-home
  map
    router-view
</template>

<script>
import Map from '@/components/Map'

export default {
  name: 'Home',
  components: { Map }
}
</script>
