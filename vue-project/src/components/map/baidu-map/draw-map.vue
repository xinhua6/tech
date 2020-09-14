<template>
    <div class="c-h100" style="position: relative">
      <baidu-map :kindJson="kindJson" :isDraw="true" ref="map" @selectArea="selectArea"  @addOverlay="addOverlay" class="c-h100"></baidu-map>
      <div v-if="showTool" class="btn-wrapper">
          <map-form @addCustomer="addCustomer" :customerPoint="customerPoint">
          </map-form>
          <div class="btn" @click="handleHistory(false)">上一步</div>
          <div class="btn" @click="handleHistory(true)">下一步</div>
          <div class="btn" @click="clearAll" title="右击选中红线可删除单个">清空</div>
          <!--<div class="btn" @click="changeColorShow">{{colorText}}</div>-->
          <el-color-picker class="btn"  v-model="oldColor"></el-color-picker>
          <!--<div class="btn" @click="save">保存</div>-->
      </div>
      <i class="el-icon-close" title="取消" @click="closeColor" v-if="isChooseColor"
           style="position: absolute;right: 10px;bottom: 354px;z-index: 1000;cursor: pointer"></i>
    </div>
</template>
<script>
import baiduMap from './map'
import MapForm from './form'

function History () {
  this.index = 0
  this.orders = []
  this.next = []
  this.back = []
}

History.prototype = {
  /*
          * action: 'add','remove clear'
          * playload:overlay
          * */
  // TODO
  add (val) {
    this.back.push(val)
  },
  getNext () {
    if (this.next.length) {
      let overlay = this.next.pop()
      this.back.push(overlay)
      return overlay
    }
  },
  getPre () {
    if (this.back.length) {
      let overlay = this.back.pop()
      this.next.push(overlay)
      return overlay
    }
  }
}
export default {
  components: {
    baiduMap,
    MapForm
  },
  props: {
    // uploadData: {
    //   type: Object
    // },
    areaName: String,
    kindJson: {
      type: String,
      default: ''
    },
    m_status: {
      type: String,
      required: false
    }
  },
  watch: {
    kindJson (val) {
      // debugger
      if (val && val.length < 3) {
        this.$_addSearchMark = true
        this.$_search && this.$_search.search(this.areaName)
      }
    },
    oldColor (val) {
      this.styleOptions.strokeColor = val
      this.styleOptions.fillColor = val
    }
  },
  data () {
    return {
      list: [],
      showTool: true,
      customerPoint: [],
      searchList: [],
      searchShow: false,
      search: '',
      oldColor: '#ff5353',
      styleOptions: {
        strokeColor: '#ff5353', // 边线颜色。
        fillColor: '#ff5353', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      },
      isChooseColor: false,
      colorText: '颜色'
    }
  },
  created () {
    this.showTool = this.m_status !== 'look'
    this.$_overlays = []
    this.$_histroy = new History()

    this.$_CustomerAdded = false
  },
  mounted () {
    // console.log('drAW-Mount', this)
    this.init()
  },
  methods: {
    selectArea (val) { // 选中一个区域

    },
    panTo (ponit) {
      this.searchShow = false
      this.$_map.panTo(new BMap.Point(ponit.lng, ponit.lat))
    },
    init () {
      if (this.$refs.map) {
        this.$_map = this.$refs.map.getMap()
        if (this.showTool) {
          this.initDrawTool()
        }
        // this.initSearch(this.$_map)
      }
    },
    initDrawTool () {
      let map = this.$_map, options = this.styleOptions
      this.$_drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true, // 是否开启绘制模式
        enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_BOTTOM_LEFT,
          offset: new BMap.Size(10, 10),
          drawingModes: [
            BMAP_DRAWING_MARKER,
            BMAP_DRAWING_CIRCLE,
            BMAP_DRAWING_POLYLINE,
            BMAP_DRAWING_POLYGON
          //  BMAP_DRAWING_RECTANGLE
          ]
        },
        circleOptions: options,
        polylineOptions: options,
        polygonOptions: options,
        rectangleOptions: options
      })
      // this.$_drawingManager = new BMapLib.DrawingManager(map, {isOpen: true,
      //   drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
      //   enableCalculate: false,
      //   drawingToolOptions: {
      //     anchor: BMAP_ANCHOR_TOP_LEFT,
      //     offset: new BMap.Size(5, 5),
      //     drawingTypes : [
      //       BMAP_DRAWING_MARKER,
      //       BMAP_DRAWING_CIRCLE,
      //       BMAP_DRAWING_POLYLINE,
      //       BMAP_DRAWING_POLYGON,
      //       BMAP_DRAWING_RECTANGLE
      //     ]
      //   },
      //   polylineOptions: {
      //     strokeColor: "#333"
      //   }})
      this.$_drawingManager.addEventListener('overlaycomplete', this.drawOverlayComplete)
    },
    // initSearch (map) {
    //   let me = this
    //   this.$_search = new BMap.LocalSearch(map, {
    //     onSearchComplete: function (results) {
    //       // console.dir(results)
    //       // 自动定位
    //       if (me.$_addSearchMark) {
    //         me.panTo(results.getPoi(0).point)
    //         return
    //       }
    //       let s = []
    //       for (var i = 0; i < results.getCurrentNumPois(); i++) {
    //         let msg = results.getPoi(i)
    //         s.push({ title: msg.title, address: msg.address, point: msg.point })
    //       }
    //       me.searchList = s
    //     }
    //   })
    // },
    // searchLocation () {
    //   this.$_search.search(this.search)
    //   this.searchShow = true
    // },
    // 单个绘制完成
    drawOverlayComplete (e) {
      // console.log(e)
      this.addOverlay(e.overlay, e.drawingMode)
    },
    addOverlay (overlays, type, isAdded) {
      // console.log(overlays, type, isAdded)
      overlays = Array.isArray(overlays) ? overlays : [overlays]
      overlays.forEach((overlay) => {
        if (!isAdded) {
          overlay.$type = type
          overlay.addContextMenu(this.createContextMenu())
          this.$_histroy.add({
            action: 'add',
            playload: overlay
          })
        }
        if (!overlay.haveColor) {
          overlay.fillColor = this.styleOptions.fillColor
          overlay.strokeWeight = this.styleOptions.strokeWeight
          overlay.strokeOpacity = this.styleOptions.strokeOpacity
          overlay.fillOpacity = this.styleOptions.fillOpacity
          overlay.haveColor = true
        }
        this.$_overlays.push(overlay)
        this.$_map = this.$_map || this.$refs.map.getMap()
        this.$_map.addOverlay(overlay)
        if (type === 'customer') {
          this.customerPoint = overlay.getPath()
        }
      })
    },
    removeOverlay (overlays, history) {
      let map = this.$_map
      overlays = Array.isArray(overlays) ? overlays : [overlays]
      overlays.forEach((overlay) => {
        map.removeOverlay(overlay)
        let index = this.$_overlays.indexOf(overlay)
        // console.log(this.$_overlays)
        if (index !== -1) {
          this.$_overlays.splice(index, 1)
          // console.log(this.$_overlays)
        }
        if (!history) {
          this.$_histroy.add({ action: 'remove', playload: overlay })
        }
      })
    },
    createContextMenu () {
      // 使用单一的contextmenu 暂时无法为所有的overlay添加事件
      let contextMenu = new BMap.ContextMenu()
      contextMenu.addItem(new BMap.MenuItem('删除', this.contextDelClick))
      return contextMenu
    },
    contextDelClick (point, msg, overlay) {
      this.removeOverlay(overlay)
    },
    handleHistory (isNext) {
      let order = isNext ? this.$_histroy.getNext() : this.$_histroy.getPre()
      if (order) {
        if (order.action === 'add') {
          if (isNext) {
            this.addOverlay(order.playload, null, true)
            return
          }
          this.removeOverlay(order.playload, true)
          return
        }
        this.addOverlay(order.playload, null, true)
      }
    },
    clearAll () {
      let map = this.$_map, overlays = this.$_overlays, [...back] = overlays
      for (let i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i])
      }
      overlays.length = 0
      this.$_histroy.add({
        type: 'remove',
        playload: back
      })
    },
    getPoint (name) {
      var myGeo = new BMap.Geocoder()
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(name, function (point) {
        if (point) {
          // console.log(point)
          // map.centerAndZoom(point, 16);
          // map.addOverlay(new BMap.Marker(point));
        } else {
          // alert("您选择地址没有解析到结果!");
        }
      })
    },
    /*
            * type:["polyline","rectangle","marker","circle","polygon"],
            * storeColor:'#fff'
            *   strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.1,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
                points:[{lat: 39.999066,lng: 116.302815}]
            * */
    // save () {
    //   let list = []
    //   let option = this.styleOptions
    //   let me = this
    //   this.$_overlays.forEach((item) => {
    //     let type = item.$type
    //     list.push({
    //       type: type,
    //       strokeWeight: option.strokeWeight,
    //       strokeOpacity: option.strokeOpacity,
    //       fillOpacity: option.fillOpacity,
    //       strokeColor: me.getMsg(type, item, 'color'),
    //       points: me.getMsg(type, item),
    //       radius: me.getMsg(type, item, 'radius')
    //     })
    //   })
    //   let obj = Object.assign(this.uploadData)
    //   obj.kindJson = JSON.stringify(list)
    //   this.$axios({
    //     url: 'WPPRMSDEMO-MAIN/expr/exprimagearea/add',
    //     method: 'post',
    //     data: obj
    //   }).then((res) => {
    //     if (res.data.success) {
    //       this.$message({
    //         message: '保存成功',
    //         type: 'success'
    //       })
    //       this.$emit('updateMap', obj.kindJson)
    //     }
    //   })
    // },
    addCustomer (customerPoint) {
      let points = []
      customerPoint.forEach((item) => {
        points.push(new BMap.Point(item.lng, item.lat))
      })
      let shape = new BMap.Polygon(points, this.styleOptions)
      this.panTo(customerPoint[0])
      this.addOverlay(shape, 'customer')
    },

    /**
       * 获取绘图的信息
       * @returns {Array}
       */
    getDrawList () {
      let list = []
      // this.styleOptions.fillColor = this.oldColor
      // let option = this.styleOptions
      let me = this
      this.$_overlays.forEach((item) => {
        let type = item.$type
        list.push({
          type: type,
          fillColor: item.fillColor,
          strokeWeight: item.strokeWeight,
          strokeOpacity: item.strokeOpacity,
          fillOpacity: item.fillOpacity,
          strokeColor: me.getMsg(type, item, 'color'),
          points: me.getMsg(type, item),
          radius: me.getMsg(type, item, 'radius')
        })
      })
      return list
    },
    getMsg (model, overlay, type) {
      if (model === 'polyline') {
        return this.polyline(overlay, type)
      }
      if (model === 'rectangle') {
        return this.rectangle(overlay, type)
      }
      if (model === 'marker') {
        return this.marker(overlay, type)
      }
      if (model === 'circle') {
        return this.circle(overlay, type)
      }
      // if (model === 'polygon') {
      return this.polygon(overlay, type)
      // }
    },
    polyline (overlay, type) {
      if (type === 'color') {
        return overlay.getStrokeColor()
      }
      return overlay.getPath()
    },
    polygon (overlay, type) {
      if (type === 'color') {
        return overlay.getStrokeColor()
      }
      return overlay.getPath()
    },
    rectangle (overlay, type) {
      if (type === 'color') {
        return overlay.getStrokeColor()
      }
      return overlay.getPath()
    },
    marker (overlay, type) {
      if (type === 'color') {
        return 'red'
      }
      return [overlay.getPosition()]
    },
    circle (overlay, type) {
      if (type === 'color') {
        return overlay.getStrokeColor()
      }
      if (type === 'radius') {
        return overlay.getRadius()
      }
      return [overlay.getCenter()]
    },
    // 自定义图形
    customer (overlay, type) {
      return this.polygon(overlay, type)
    },
    closeColor () {
      this.isChooseColor = false
      this.colorText = '颜色'
    },
    changeColorShow () {
      this.isChooseColor = !this.isChooseColor
      if (this.isChooseColor) {
        this.colorText = '确定'
        return
      }
      this.colorText = '颜色'
      this.styleOptions.strokeColor = this.oldColor.hex
    }
  },
  beforeDestroy () {
    this.$_histroy = null
  }

}
</script>
<style>
    .BMapLib_Drawing.anchorBL {
        display: block !important;
    }
</style>
<style scoped>
    .btn-wrapper {
        position: absolute;
        color: #1f73b0;
        bottom: 16px;
        right: 10px;
        height: 47px;
        border: 1px solid #666;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    }

    .btn {
        border-right: 1px solid #d2d2d2;
        float: left;
        width: 64px;
        height: 45px;
        line-height: 45px;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        background: #fff;
    }

</style>
