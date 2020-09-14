/**
 *@module
 *
 * 全局组件注册入口
 * Vue 原型添加入口
 */

import Element from 'element-ui'
import prototype from './prototype'
import * as form from './form'
import { WpWindow } from './win'
import { WpTable, WpElTable } from './table'
import { WpPager } from './pager'

const components = {
  ...form,
  WpPager,
  WpWindow,
  WpTable,
  WpElTable
}

const install = function (Vue, opts = {}) {
  Vue.use(Element)
  for (let key in prototype) {
    Vue.prototype[`$${key}`] = prototype[key]
  }
  Object.keys(components).forEach(key => {
    const component = components[key]
    if (process.env.NODE_ENV === 'development') {
      if (!component.name) {
        console.error(component, '需要为此组件配置name属性,作为组件使用的唯一标识')
      }
    }
    Vue.component(component.name, component)
  })
}

export default {
  install
}
