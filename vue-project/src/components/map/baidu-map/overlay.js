import Vue from 'vue'

/**
 * 百度地图中自定义 vue组件覆盖物
 * @param options  {point:"覆盖物显示的点",component:"展示的组件"，draw:draw 回调}
 * @constructor
 */
function MyOverlay (options) {
  // vue组件覆盖物实例
  this._vm = null
  this._point = options.point
  this._infoWindow = options.component
  this._draw = options.draw || draw
  this._options = options
}

/**
 * 自定义覆盖物默认draw 方法
 * @param overlay 百度地图overlay的实例
 */
function draw (overlay) {
  const div = this._vm.$el
  var pixel = this._map.pointToOverlayPixel(this._point)
  div.style.left = pixel.x + 'px'
  div.style.top = pixel.y + 'px'
}

MyOverlay.prototype = new BMap.Overlay()
MyOverlay.prototype.initialize = function (map) {
  const div = document.createElement('div')
  const Win = Vue.extend(this._infoWindow)
  const vm = new Win()
  this._map = map
  this._vm = vm
  map.getPanes().labelPane.style.zIndex = 999
  map.getPanes().labelPane.appendChild(div)
  vm.$mount(div)
  return div
}
MyOverlay.prototype.draw = function () {
  this._draw(this)
}

export default MyOverlay
