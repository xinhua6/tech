import Vue from 'vue'
import Win from './window'
// console.log(Win,'windowConstroru')
/**
 * 函数式调用弹窗
 * @param component,详细页面组件
 * @param options，页面配置
 */
export default function (component, options) {
  const Component = Vue.extend(component)
  if (process.env.NODE_ENV === 'development') {
    if (!(this instanceof Vue)) {
      console.error(`需要vue实例调用`)
      return
    }
  }
  /**
   * options propsData:{} 对应 组件的props，其余的相同
   */
  const instance = new Component({
    ...options,
    parent: this
  })
  instance.$mount()
  // instance.show = true
}

function showWin (component, options) {
  const Component = Vue.extend(Component)
  if (process.env.NODE_ENV === 'development') {
    if (!(this instanceof Vue)) {
      console.error(`需要vue实例调用`)
    }
  }
}

function concatWin (Component, options = {}) {
  return {
    mixins: [options],
    props: Component.props,
    render (h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vnode => {
          vnode.context = this._self
          return vnode
        })

      return h(Component, {
        on: this.$listeners,
        props: this.$props,
        // 透传 scopedSlots
        scopedSlots: this.$scopedSlots,
        attrs: this.$attrs
      }, slots)
    }
  }
}
