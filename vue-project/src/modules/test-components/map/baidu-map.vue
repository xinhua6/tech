<template>
  <div class="main">
    <bai-map ref="map"></bai-map>
  </div>
</template>

<script>
  import BaiMap from 'src/components/map/baidu-map/draw-map'
  export default {
    name: 'baidu-map',
    components: {
      BaiMap
    },
    data () {
      return {
      }
    },

    computed: {},

    props: {},

    mounted () {
    },
    methods: {}

  }
</script>

<style scoped>
</style>
