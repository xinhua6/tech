function Info (map, options) {
  this.map = map
  // 所有覆盖物  需要包含 getPosition方法 获取单前位置
  this.markers = options.markers || []
  // 一直显示的覆盖物
  this.staticMarkers = options.staticMarkers || []
  // 显示的覆盖物
  this.show = []
  // 两点之间的距离，单位是米
  this.distance = options.distance || 20
  // 相差的像素距离
  this.minPx = options.minPx || 40
  // 去距离 与像素距离最大值 决定是否显示
  this.maxDistance = this.distance
  this.geoc = new BMap.Geocoder()
  map.addEventListener('zoomend', () => {
    this.getLocation()
    this.setDistance()
    this.render()
  })
  map.addEventListener('moveend', () => {
    this.render()
  })
  this.init()
}

Info.prototype = {
  init () {
    this.setDistance()
    this.staticMarkers.forEach(mark => this.map.addOverlay(mark))
    this.render()
  },
  render () {
    const bounds = this.map.getBounds()
    const newShow = []
    this.show.forEach(mark => {
      if (bounds.containsPoint(mark.getPosition())) {
        return newShow.push(mark)
      }
      this.removeMarkFormMap(mark)
    })
    // 保留当前显示覆盖物
    this.show = newShow
    this.markers.forEach((mark) => {
      if (bounds.containsPoint(mark.getPosition()) && this.show.indexOf(mark) === -1) {
        this.addMarkToMap(mark)
      }
    })
  },
  removeMarkFormMap (mark) {
    this.map.removeOverlay(mark)
  },
  addMarkToMap (mark) {
    const isHide = this.show.some((item) => {
      const showPos = item.getPosition()
      const markPos = mark.getPosition()
      const distance = this.map.getDistance(showPos, markPos)
      if (distance < this.maxDistance) {
        return true
      }
    })
    if (!isHide) {
      this.show.push(mark)
      this.map.addOverlay(mark)
    }
  },
  clear () {
    this.show.forEach((mark) => {
      this.map.removeOverlay(mark)
    })
    this.show = []
  },
  setDistance () {
    let a = this.map.overlayPixelToPoint(new BMap.Pixel(0, 0))
    let b = this.map.overlayPixelToPoint(new BMap.Pixel(1, 0))
    this.maxDistance = Math.max(this.distance, this.map.getDistance(a, b) * this.minPx)
  },
  getLocation () {
    return new Promise(resolve => {
      this.geoc.getLocation(this.map.getCenter(), (rs) => {
        resolve(res)
        // let area = this.getAreaName(this.map.getZoom(), rs.addressComponents)
        // this.vm.getAreaCodeFromName(area, this.show)
        // console.log(rs)
        // console.log(a.province + ', ' + a.city + ', ' + a.district + ', ' + a.street + ', ' + a.streetNumber)
      })
    })
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
  }
  // getPiex (a, b) {
  //   let a1 = this.map.pointToOverlayPixel(a)
  //   let b1 = this.map.pointToOverlayPixel(b)
  //   console.log(Math.max(Math.abs(a1.x - b1.x), Math.abs(a1.y - b1.y)))
  //   return Math.max(Math.abs(a1.x - b1.x), Math.abs(a1.y - b1.y))
  // },
}
