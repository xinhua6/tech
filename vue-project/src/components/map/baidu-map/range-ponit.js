import Vue from 'vue'
// import data from './tem-data'
import StakeInfo from './stake-info'
import circleBlue from './img/circle-blue.png'
import circleGreen from './img/circle-green.png'
function MyOverlay (point, data, infoWindow) {
  this._point = point
  this._data = data
  // this._name = name
  this._infoWindow = infoWindow
}

MyOverlay.prototype = new BMap.Overlay()
MyOverlay.prototype.initialize = function (map) {
  let div = document.createElement('div')
  let Win = Vue.extend(this._infoWindow)
  let vm = new Win()
  this._map = map
  this._vm = vm
  map.getPanes().labelPane.style.zIndex = 999
  map.getPanes().labelPane.appendChild(div)
  vm.$mount(div)
  return div
}
MyOverlay.prototype.draw = function () {
  let div = this._vm.$el
  var pixel = this._map.pointToOverlayPixel(this._point)
  div.style.left = pixel.x + 'px'
  div.style.top = pixel.y + 'px'
  // div.style.display = 'block'
}
MyOverlay.prototype.setData = function (point, blockMsg) {
  if (point) {
    this._point = point
  }
  this._vm.blockMsg = blockMsg
  this._vm.show = true
}

// 根据地图的当前位置 显示不同的点
function Marker (vm, map, options) {
  this.vm = vm
  this.map = map
  this.markers = options.markers || []
  this.show = []
  // 两点之间的距离，单位是米
  this.distance = options.distance || 20
  this.maxDistance = this.distance
  this.minPx = options.minPx || 40
  this.geoc = new BMap.Geocoder()
  this.init()
  map.addEventListener('zoomend', () => {
    this.getLocation()
    this.setDistance()
    this.render()
  })

  map.addEventListener('moveend', () => {
    this.getLocation()
    this.rerender()
  })
}

Marker.prototype = {
  // 重新显示点的信息
  init () {
    this.setDistance()
    this.render()
  },
  setDistance () {
    let a = this.map.overlayPixelToPoint(new BMap.Pixel(0, 0))
    let b = this.map.overlayPixelToPoint(new BMap.Pixel(1, 0))
    this.maxDistance = Math.max(this.distance, this.map.getDistance(a, b) * this.minPx)
  },
  getCenterMark () { // 或当前地图区域最中心的标注点
    let resultMark
    let bounds = this.map.getBounds()// 获取当前地图区域
    // let centerPoint = bounds.getCenter()// 获取当前区域的中心点
    let centerPoint = this.map.getCenter()
    // let minDistance = this.maxDistance
    let minDistance = 100000
    this.show.forEach((mark) => { // 获取离区域中心最近的那个标注点
      if (bounds.containsPoint(mark.getPosition())) {
        let distance = this.map.getDistance(centerPoint, mark.getPosition())
        if (distance < minDistance) {
          minDistance = distance
          resultMark = mark
        }
      }
    })
    return resultMark
  },
  getLocation () {
    if (this.map.getZoom() < 9) {
      this.vm.updateAreaCode('0')
      return
    }
    this.geoc.getLocation(this.map.getCenter(), (rs) => {
      let area = this.getAreaName(this.map.getZoom(), rs.addressComponents)
      this.vm.getAreaCodeFromName(area, this.show)
      // console.log(rs)
      // console.log(a.province + ', ' + a.city + ', ' + a.district + ', ' + a.street + ', ' + a.streetNumber)
    })
  },
  render () {
    this.clear()
    this.getShow()
  },
  rerender () {
    let bounds = this.map.getBounds()
    this.markers.forEach((mark) => {
      if (bounds.containsPoint(mark.getPosition())) {
        if (mark.hide) {
          this.addShow(mark)
        }
        return
      }
      let index = this.show.indexOf(mark)
      if (index !== -1) {
        this.show.splice(index, 1)
        this.clear(mark)
      }
    })
  },
  getShow (isMove) {
    let bounds = this.map.getBounds()
    this.markers.forEach((mark) => {
      if (bounds.containsPoint(mark.getPosition())) {
        this.addShow(mark)
      }
    })
  },
  addShow (mark) {
    mark.hide = false
    this.show.some((item) => {
      let showPos = item.getPosition()
      let markPos = mark.getPosition()
      let distance = this.map.getDistance(showPos, markPos)
      if (distance < this.maxDistance) {
        mark.hide = true
        return true
      }
    })
    if (!mark.hide) {
      this.show.push(mark)
      this.map.addOverlay(mark)
    }
  },
  // getPiex (a, b) {
  //   let a1 = this.map.pointToOverlayPixel(a)
  //   let b1 = this.map.pointToOverlayPixel(b)
  //   console.log(Math.max(Math.abs(a1.x - b1.x), Math.abs(a1.y - b1.y)))
  //   return Math.max(Math.abs(a1.x - b1.x), Math.abs(a1.y - b1.y))
  // },
  clear (mark) {
    if (mark) {
      mark.hide = true
      this.map.removeOverlay(mark)
      return
    }
    this.show.forEach((mark) => {
      mark.hide = true
      this.map.removeOverlay(mark)
    })
    this.show = []
  },
  getAreaName (zoom, bMapArea) {
    // console.log(bMapArea)
    if (zoom < 9) {
      // 省的数据
      return '0'
    }
    if (zoom >= 9 && zoom < 13) {
      // 市的数据
      return bMapArea.province
    }
    if (zoom >= 13 && zoom < 15) {
      // 区或镇
      return bMapArea.city
    }
    return bMapArea.district
    // 村
  }
}

let ponitMixin = {
  created () {
  },
  mounted () {
    //! this.isDraw && setTimeout(this.creatMarks, 1000)
    let that = this
    setTimeout(function () {
      if (!that.isDraw) {
        that.$_areaMsg = []
        that.$_areaCache = {
          '0': 0
        }
        // that.getMark()
        that.getMark(1)
        that.getMark(-1)
        that.getArea()
      }
    }, 1000)
  },
  methods: {
    getArea () {
      this.$axios({
        url: 'WPPRMSBASE/expr/prmsareaset/findall'
      }).then((res) => {
        // console.log(res.data, 'prmsareaset')
        this.handleArea(res.data)
      })
    },
    handleArea (val) {
      for (let i = 0; i < val.length; i++) {
        if (val[i].data.length > 0) {
          val = val.concat(val[i].data)
        }
      }
      this.$_areaMsg = val
      // console.log(val,'yiwei')
    },
    getAreaCodeFromName (name, showMarks) {
      if (!name) {
        this.getAreaCodeFromShow(showMarks)
        return
      }
      if (this.$_areaCache[name]) {
        this.updateAreaCode(this.$_areaCache[name])
        return
      }
      let inArea = this.$_areaMsg.some((item) => {
        if (item.areaName === name) {
          this.$_areaCache[name] = item.areaCode
          this.updateAreaCode(item.areaCode)
          return true
        }
      })
      if (!inArea) {
        console.log('路线不在此范围内', name)
      }
    },
    updateAreaCode (code) {
      if (code) {
        this.$emit('changeArea', code)
      }
    },
    getAreaCodeFromShow (data) {
      let name = this.$_map.getZoom() > 17 ? 'areaCode' : 'parent'
      data.some((item) => {
        if (item._data.lev === 5) {
          this.updateAreaCode(item._data[name])
          return true
        }
      })
    },
    getMark (code = 0) {
      this.$axios({
        url: 'WPPRMSBASE/expr/prmsindex/findallpostionforline',
        params: {
          // 0表示等于中心线,1表示右线，-1表示小于左线
          position: code
        },
        methods: 'get'
      }).then((res) => {
        this.creatMarks(res.data)
        // this.creatMarks(data)
      })
    },
    creatMarks (data) {
      let markers = []
      let points = []
      for (var i = 0; i < data.length; i++) {
        // let mark = new BMap.Marker(new BMap.Point(data[i].lng, data[i].lat), {
        points.push(new BMap.Point(data[i].longitude, data[i].latitude))
        let mark = new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude), {
          icon: new BMap.Icon(
            data[i].ratio2 === 100 ? circleGreen : circleBlue,
            new BMap.Size(30, 40),
            {
              anchor: new BMap.Size(10, 10)
            }
          )
        })
        mark._data = data[i]
        mark.addEventListener('click', this.markClick)
        markers.push(mark)
      }
      let style = {
        fillOpacity:
          1,
        strokeColor:
          '#ff5353',
        // strokeOpacity:
        //   0.8,
        strokeWeight:
          2
      }
      // 连线
      let overlay = new BMap.Polyline(points, style)
      this.$_map.addOverlay(overlay)
      let m = new Marker(this, this.$_map, { markers })
      // console.log(m, '桩号点的集合')
      if (data.length) {
        this.panTo(markers[0].getPosition())
      }
    },
    markClick (type, target) {
      // console.log(type, target)
      if (!this.$_stakeInfo) {
        this.$_stakeInfo = new MyOverlay(type.point, {}, StakeInfo)
        this.$_map.addOverlay(this.$_stakeInfo)
      }
      this.$_stakeInfo.setData(type.point, type.target._data)
      this.$_stakeInfo.draw()
    }
  }
}

export { MyOverlay, ponitMixin }
