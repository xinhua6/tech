/**
 *@module
 *
 * 全局组件注册入口
 * Vue 原型添加入口
 */

import Element from 'element-ui'

const install = function (Vue, opts = {}) {
  Vue.use(Element)
}

export default {
  install
}