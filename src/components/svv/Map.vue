<template lang="pug">
#svv-map
  .map(ref="map")
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import rawData from '@/assets/route/map.geojson'
import 'Leaflet.MultiOptionsPolyline'

export default {
  name: 'SvvMap',
  data: () => ({
    map: null,
    route: null,
    zoom: 10,
    center: new L.LatLng(69.24, 20.47)
  }),
  computed: {
    layer () {
      return L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png')
    }
  },
  mounted () {
    // Init map
    this.map = L.map(this.$refs.map, {
      center: this.center,
      zoom: this.zoom,
      layers: this.layer,
      attributionControl: false,
      zoomControl: false,
      dragging: !L.Browser.mobile
    })

    this.route = L.geoJSON(rawData, {
      style: feature => {
        return {
          color: '#ff9604'
        }
      }
    }).addTo(this.map)
  }
}
</script>

<style lang="stylus">
#svv-map
  position absolute
  top 0
  left 0
  right 0
  height 600px

  .map
    height 100%

    .leaflet-tooltip-top:before,
    .leaflet-tooltip-bottom:before,
    .leaflet-tooltip-left:before,
    .leaflet-tooltip-right:before
      border 0

    .tooltip
      box-shadow none
      margin-top 20px
      padding 2px 4px 0
      border 0
      font-family monospace
      font-size 9px
      background rgba(0, 0, 0, .5)
      color #FFF
</style>
