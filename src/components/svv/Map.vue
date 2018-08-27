<template lang="pug">
#svv-map
  .map(ref="map")
</template>

<script>
import L from 'leaflet'
import 'leaflet-geometryutil'
import 'leaflet/dist/leaflet.css'
import rawData from '@/assets/route/map2.geojson'
import 'Leaflet.MultiOptionsPolyline'
import { MAX_GPS_ERROR, WALK_N_STEPS, DEFAULT_MAP_CENTER } from '@/config'

export default {
  name: 'SvvMap',
  data: () => ({
    map: null,
    route: null,
    routeData: null,
    zoom: 11,
    dataUrl: null
  }),
  computed: {
    layer () {
      return L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png')
    }
  },
  watch: {
    ApiMapThings (things) {
      // Create new raw route data
      let newRawData = JSON.parse(JSON.stringify(rawData))

      for (let thing of things) {
        try {
          // Find lat, lng of Thing GPS pos
          const { pos, tmp, hum } = thing.state
          const [lat, lng] = pos.split(',')

          // Find closest layer on route blueprint
          const closestLayer = L.GeometryUtil.closestLayer(this.map, this.route.getLayers(), [lat, lng])

          // Skip if Thing GPS pos is too far away
          if (closestLayer.distance > MAX_GPS_ERROR)
            continue

          // Iterate route layers
          for (let routeLayer of this.route.getLayers()) {
            // If found closest Thing layer equals route layer,
            // change route layer z-value accordingly.
            if (closestLayer.layer === routeLayer) {
              try {
                const { id } = routeLayer.feature.properties
                let rawLayer = newRawData[id]
                rawLayer.properties.thing = thing
                rawLayer.properties.z = 15
                rawLayer.properties.tmp = tmp
                rawLayer.properties.hum = hum
                rawLayer.properties.opacity = 1

                // Walk backward
                let count = 0
                let limit = (id - WALK_N_STEPS < 0) ? 0 : id - WALK_N_STEPS
                for (let i = id - 1; i >= limit; i--) {
                  let rawLayerBack = newRawData[i]
                  rawLayerBack.properties.thing = thing
                  rawLayerBack.properties.z = 15
                  rawLayerBack.properties.tmp = tmp
                  rawLayerBack.properties.hum = hum

                  let opacity = 1 - (count / WALK_N_STEPS)
                  if (rawLayerBack.properties.hasOwnProperty('opacity')) {
                    if (rawLayerBack.properties.opacity < opacity)
                      rawLayerBack.properties.opacity = opacity
                  } else {
                    rawLayerBack.properties.opacity = opacity
                  }

                  count += 1
                }

                // Walk forward
                count = 0
                limit = (id + WALK_N_STEPS > newRawData.length - 1) ? newRawData.length - 1 : id + WALK_N_STEPS
                for (let i = id + 1; i <= limit; i++) {
                  let rawLayerBack = newRawData[i]
                  rawLayerBack.properties.thing = thing
                  rawLayerBack.properties.z = 15
                  rawLayerBack.properties.tmp = tmp
                  rawLayerBack.properties.hum = hum
                  rawLayerBack.properties.opacity = 1 - (count / WALK_N_STEPS)

                  let opacity = 1 - (count / WALK_N_STEPS)
                  if (rawLayerBack.properties.hasOwnProperty('opacity')) {
                    if (rawLayerBack.properties.opacity < opacity)
                      rawLayerBack.properties.opacity = opacity
                  } else {
                    rawLayerBack.properties.opacity = opacity
                  }

                  count += 1
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
      }

      this.route.clearLayers()
      this.route.addData(newRawData)
    }
  },
  methods: {
    getWeight (properties) {
      let { z } = properties
      return z === 0 ? 5 : 5
    },
    getLineCap (properties) {
      let { z } = properties
      return z === 0 ? 'round' : 'round'
    },
    getColor (properties) {
      let { z, opacity } = properties

      if (z < 0) {
        return `rgba(0, 0, 255, ${opacity})`
      } else if (z > 0) {
        return `rgba(255, 0, 0, ${opacity})`
      } else {
        return 'rgba(0,0,0,0)'
      }
    }
  },
  mounted () {
    // Init map
    this.map = L.map(this.$refs.map, {
      center: DEFAULT_MAP_CENTER,
      zoom: this.zoom,
      layers: this.layer,
      attributionControl: false,
      zoomControl: false
    })

    this.route = L.geoJSON(rawData, {
      style: feature => {
        return {
          weight: this.getWeight(feature.properties),
          lineCap: this.getLineCap(feature.properties),
          color: this.getColor(feature.properties) // '#ff9604' = SVV Orange
        }
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties.hasOwnProperty('thing')) {
          layer.bindTooltip(`
            <h1>${feature.properties.thing.thingName}</h1>
            <p>
              Temperature: <b>${feature.properties.tmp}°C</b><br>
              Humidity: <b>${feature.properties.hum}%</b>
            </p>`, {
            direction: 'top'
          })
        }
      }
    }).addTo(this.map)
  },
  beforeDestroy () {
    this.map.remove()
  }
}
</script>

<style lang="stylus">
#svv-map
  position absolute
  top 0
  left 0
  right 0
  bottom 0

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
