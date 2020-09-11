<template>
  <div class="map">
    <div ref="map" style="height: 100%;background:#f4f4f4 "></div>
  </div>
</template>
<script>
  import { MAP_CENTER } from 'src/config/index'

  function getMapScript () {
    if (!window.BMap) {
      const ak = 'mTmk0McyG6SQiIa6XB9z2dS8Rg59cNug'
      window.BMap = {}
      const script = document.createElement('script')
      window.document.body.appendChild(script)
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=__initBaiduMap`
      window.BMap._preloader = new Promise((resolve, reject) => {
        window.__initBaiduMap = function () {
          resolve(window.BMap)
          window.document.body.removeChild(script)
          delete window.BMap._preloader
          delete window.__initBaiduMap
        }
      })
      return window.BMap._preloader
    } else if (!window.BMap._preloader) {
      return Promise.resolve(window.BMap)
    } else {
      return window.BMap._preloader
    }
  }

  export default {
    props: {
      // 地图缩放层级
      zoom: {
        type: Number,
        default: 13
      },
      center: {
        type: [String, Array],
        default () {
          return MAP_CENTER
        }
      },
      mapStyle: {
        default () {
          return { style: 'grayscale' }
        }
      },
      options: {
        default () {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    mounted () {
      getMapScript().then(this.initMap)
    },
    methods: {
      /**
       * 获取地图的实例
       * @returns {BMap.Map|*}
       */
      getMap () {
        return this.$_map
      },
      /**
       * 移动到某个点
       * @param ponit Object {lng:null,lat:null}
       */
      panTo (ponit) {
        if (this.$_mapLoaded) {
          if (ponit) {
            let bpoints = new BMap.Point(ponit.lng, ponit.lat)
            // console.log(this.$_map, bpoints)
            this.$_map.panTo(bpoints)
          }
        } else {
          setTimeout(() => {
            this.panTo(ponit)
          }, 100)
        }
      },
      /**
       * 根据ip地址定位
       */
      ipPosition () {
        const myCity = new BMap.LocalCity()
        myCity.get((result) => {
          let cityName = result.name
          this.$_map.setCurrentCity(cityName)
          this.panTo(result.center)
        })
      },
      /**
       * 初始化搜索功能
       * @param map
       */
      /*     initSearch (map) {
             let me = this
             this.$_search = new BMap.LocalSearch(map, {
               renderOptions: { map: map },
               onSearchComplete: function (results) {
                 // console.dir(results)
                 // 自动定位
                 if (me.$_addSearchMark) {
                   me.panTo(results.getPoi(0).point)
                   return
                 }
                 let s = []
                 for (var i = 0; i < results.getCurrentNumPois(); i++) {
                   let msg = results.getPoi(i)
                   s.push({ title: msg.title, address: msg.address, point: msg.point })
                 }
                 me.searchList = s
               }
             })
           }, */
      initMap () {
        const map = new BMap.Map(this.$refs.map, {
          enableMapClick: false,
          minZoom: 4,
          ...this.options
        })
        map.addEventListener('load', () => {
          this.$_mapLoaded = true
          this.$emit('map-ready', map)
        })
        map.setMapStyle(this.mapStyle)
        map.centerAndZoom(typeof this.center === 'string' ? this.center : new BMap.Point(this.center[0], this.center[1]), this.zoom)
        map.enableScrollWheelZoom(true)
        this.$_map = map
      }
    }
  }
</script>
<style scoped lang="scss">
  .map {
    height: 100%;
    position: relative;
    background: #f4f4f4;
  }
</style>
<style>
  .anchorBL {
    display: none !important;
  }
</style>
