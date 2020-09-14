<template>
    <div class="map">
        <slot>
            <div style="position: absolute;top:20px;left: 15px;z-index: 1" @keyup.enter="searchLocation">
                <el-input v-model="searchVal" placeholder="搜索位置">
                    <el-button slot="append" icon="el-icon-search" @click="searchLocation"></el-button>
                </el-input>
                <div class="search-list" v-show="searchShow">
                    <div v-for="item in searchList" @click="panTo(item.point)" class="item">
                        <span class="title">{{item.title}}</span>
                        <span class="address">{{item.address}}</span>
                    </div>
                </div>
            </div>
        </slot>
        <div ref="map" style="height: 100%"></div>
    </div>
</template>
<script>
import InfoWindow from './info-window'
import { ponitMixin, MyOverlay } from './range-ponit'
import { MAP_CENTER } from 'src/config/index'

export default {
  mixins: [ponitMixin],
  data () {
    return {
      searchList: [],
      searchShow: false,
      searchVal: null
    }
  },
  props: {
    blocking: [String, Number],
    blockDone: [String, Number],
    // 是否为新增编辑红线
    isDraw: { type: Boolean, dafault: false },
    // 编辑画图信息
    kindJson: {
      type: String,
      default: null
    },
    // 首页红线信息 暂定 红线kid  与画图信息
    homeShape: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted () {
    // console.log('homeMount', this)
    this.initMap()
    // 红线画图信息
    this.$_shapeMap = {}
  },
  watch: {
    // 画图信息
    kindJson: function (val) {
      this.draw(val)
    },
    homeShape: function (val) {
      this.drawHome(val)
    }
  },
  methods: {
    getMap () {
      return this.$_map
    },
    panTo (ponit) {
      this.searchShow = false
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
    ipPosition () {
      let myCity = new BMap.LocalCity()
      myCity.get((result) => {
        let cityName = result.name
        this.$_map.setCurrentCity(cityName)
        this.panTo(result.center)
      })
    },
    initSearch (map) {
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
    },
    searchLocation () {
      this.$_search.search(this.searchVal)
      this.searchShow = true
    },
    initMap () {
      let map = new BMap.Map(this.$refs.map, { enableMapClick: false, minZoom: 4 })
      map.addEventListener('load', () => {
        this.$_mapLoaded = true
        this.$emit('mak')
      })
      map.setMapStyle({
        styleJson: [
          {
            'featureType': 'poilabel',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }
        ]
      })
      map.centerAndZoom(MAP_CENTER, 13)
      // 地图类型
      setTimeout(function () {
        map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))// 右下角，添加比例尺
      }, 1000)
      map.addControl(new BMap.MapTypeControl({
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
        ]
      }))
      map.addControl(new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_ZOOM,
        offset: new BMap.Size(20, 80)
      }))
      map.enableScrollWheelZoom(true)
      this.$_map = map
      this.initSearch(this.$_map)
      // this.$nextTick(()=>{
      //   if (this.kindJson && this.kindJson.length > 3) {
      //     this.draw(this.kindJson)
      //   } else {
      //     this.ipPosition()
      //   }
      // })
    },
    search () {
      this.$emit('search', this.searchVal)
    },
    draw (kindJson) {
      this.$_map.clearOverlays()
      this.$_shapeMap = {}
      // console.log('drawmap',kindJson)
      if (kindJson && kindJson.length > 2) {
        let overlays = JSON.parse(kindJson)
        this.renderOverlay(overlays, {})
        this.panTo(overlays[0] && overlays[0].points[0])
      }
    },
    drawHome (val) {
      this.$_map.clearOverlays()
      let block
      val.forEach((blockMsg) => {
        if (blockMsg.overlaysMsg && blockMsg.overlaysMsg.length > 3) {
          block = blockMsg
        }
        this.renderOverlay(JSON.parse(blockMsg.overlaysMsg), blockMsg)
      })
      if (block) {
        let shape = this.$_shapeMap[block.kid]
        shape && this.panTo(shape._centerPonit)
      }
    },
    homeShapeClick (e, blockMsg) {
      if (!this.$_myOverlay) {
        this.$_myOverlay = new MyOverlay(e.point, blockMsg, InfoWindow)
        this.$_map.addOverlay(this.$_myOverlay)
      }
      this.$_myOverlay.setData(e.point, blockMsg)
      this.$_myOverlay.draw()
      // console.log(e, kid, 'shapClick')
    },
    renderOverlay (overlaysMsg, blockMsg) {
      let map = this.$_map
      if (overlaysMsg) {
        overlaysMsg.forEach((item) => {
          // 实例化图形
          let shape = this['get' + item.type](item, blockMsg)
          shape.addEventListener('click', (e) => {
            if (this.isDraw) {
              // console.log(shape,'1111111111111111')
              this.$emit('selectArea', item)
            } else {
              this.homeShapeClick(e, blockMsg)
            }
          })
          // 由外部容器管理
          if (this.isDraw) {
            this.$emit('addOverlay', shape, item.type)
            console.log(item)
            return
          }
          this.$_shapeMap[blockMsg.kid] = shape
          map.addOverlay(shape)
        })
      }
    },
    getpolyline (msg, blockMsg) {
      let style = this.getDrawOptions(msg, blockMsg),
        points = this.handlePonit(msg.points),
        overlay = new BMap.Polyline(points, style)
      this.setShapePoint(overlay, points[0])
      return overlay
    },
    // 自定义图形
    getcustomer (msg, blockMsg) {
      return this.getpolygon(msg, blockMsg)
    },
    getpolygon (msg, blockMsg) {
      let style = this.getDrawOptions(msg, blockMsg),
        points = this.handlePonit(msg.points),
        overlay = new BMap.Polygon(points, style)
      this.setShapePoint(overlay, points[0])
      return overlay
    },
    getrectangle (msg, blockMsg) {
      let style = this.getDrawOptions(msg, blockMsg),
        points = this.handlePonit(msg.points),
        overlay = new BMap.Polygon(points, style)
      this.setShapePoint(overlay, points[0])
      return overlay
    },
    getmarker (msg, blockMsg) {
      let ponit = new BMap.Point(msg.points[0].lng, msg.points[0].lat)
      let overlay = new BMap.Marker(ponit)
      this.setShapePoint(overlay, ponit)
      return overlay
    },
    getcircle (msg, blockMsg) {
      let style = this.getDrawOptions(msg, blockMsg),
        point = this.handlePonit(msg.points)[0]
      let overlay = new BMap.Circle(point, msg.radius, style)
      this.setShapePoint(overlay, point)
      return overlay
    },
    handlePonit (arry) {
      let arr = []
      if (arry) {
        arry.forEach((item) => {
          arr.push(new BMap.Point(item.lng, item.lat))
        })
      }
      return arr
    },
    getDrawOptions (msg, blockMsg) {
      return {
        strokeColor: blockMsg.progress === 100 ? '#449df2' : msg.strokeColor,
        strokeWeight: msg.strokeWeight,
        strokeOpacity: msg.strokeOpacity,
        fillOpacity: msg.fillOpacity,
        fillColor: blockMsg.progress === 100 ? '#449df2' : msg.fillColor
      }
    },
    setShapePoint (overlay, ponit) {
      overlay._centerPonit = ponit
    },
    showInfoWindow (blockMsg) {
      let shape = this.$_shapeMap[blockMsg.kid]
      if (shape) {
        this.panTo(shape._centerPonit)
        this.homeShapeClick({ point: shape._centerPonit }, blockMsg)
      } else {
        this.homeShapeClick({ point: this.$_map.getCenter() }, blockMsg)
      }
    }
  }
}
</script>
<style scoped lang="scss">
    .map {
        height: 100%;
        position: relative;
        padding: 10px;
        background: #d5e3ec;
    }

    .block-tip {
        position: absolute;
        width: 220px;
        right: 50px;
        bottom: 50px;
        z-index: 1;
    }

    .done, .doing {
        display: inline-block;
        margin-right: 10px;
        width: 100px;
        height: 50px;
        background: #fff;
        text-align: center;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .6);
        span {
            display: inline-block;
            padding: 10px;
        }
    }

    .done .text {
        background: #0196ff;
        color: #fff;
        padding: 5px;
        font-size: 12px;
    }

    .doing .text {
        background: #ea4342;
        color: #fff;
        padding: 5px;
        font-size: 12px;
    }

    .search-list {
        background-color: #fff;
        border-top: 1px solid #E4E6E7;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
        border-radius: 0 0 2px 2px;
    }

    .item {
        padding: 8px 5px;
        font-style: normal;
        cursor: pointer;
    }

    .title {
        color: #666;
    }

    .address {
        margin-left: 10px;
        margin-right: 20px;;
        color: #999;
    }
</style>
<style>
    .anchorBL {
        display: none !important;
    }
</style>
