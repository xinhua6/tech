/**
 * 共用函数,通常与业务相关
 * 此为多系统共用
 * @module
 *
 */

import bus from './bus.js'
import Vue from 'vue'

export function baseWarn (msg, successCb, cancelCb, parama) {
  Vue.prototype.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    successCb && successCb(parama)
  }).catch(() => {
    cancelCb && cancelCb(parama)
  })
}

/**
 * 向上查找组件
 * @param attrs 组件包含的属性
 * @returns {*}
 */
function up (attrs) {
  let name = attrs || 'xtype'
  let parent = this.$parent || this.$root
  let type = parent[name] || parent.$attrs[name]
  while (parent && (!type)) {
    parent = parent.$parent
    if (parent) {
      type = parent[name] || parent.$attrs[name]
    }
  }
  if (parent) {
    return parent
  }
  console.error('找不到包含' + name + '属性的的组件，请为所要的组件添加' + name + '属性')
  return {}
}

/**
 *  获取组件所属菜单的tableId
 * @returns {{}}
 */
export function getMenuTableId () {
  if (process.env.NODE_ENV === 'development') {
    if (!this._isVue) {
      console.error('请使用vue组件实例调用')
    }
  }
  if (this.$route.query.parentTableId) {
    return parseInt(this.$route.query.parentTableId)
  }
  const vm = up.call(this, 'wptableId')
  return vm.wptableId || vm.$attrs.wptableId
}

/**
 * 注册系统模块菜单信息store
 * @param moudleName 模块名称
 * @param config store配置
 * @param menuList 菜单信息
 * @param sysMsg 后台系统配置信息
 */
export function registerSysMoudle (moudleName, config, menuList, sysMsg) {
  if (!config.state) {
    config.state = {}
  }
  if (!config.mutations) {
    config.mutations = {}
  }
  config.state.menuList = menuList
  config.state.sysMsg = sysMsg
  config.mutations[`SET_MENU_LIST`] = function (state, data) {
    state.menuList = data
  }
  config.state.activeMenu = {}
  config.mutations[`SET_ACTIVE_MENU`] = function (state, data) {
    state.activeMenu = data
  }
  bus.$emit('register-module', moudleName, config)
}

/**
 * 表单验证失败提醒
 * @param successCb 确定回调
 * @param cancelCb  取消回调
 * @param parama 参数
 */
export function formErrorWarn (successCb, cancelCb, parama) {
  baseWarn('数据填写有误,请修改', successCb, cancelCb, parama)
}

/**
 * 删除数据提醒
 * @param successCb 确定回调
 * @param cancelCb  取消回调
 * @param parama 参数  建议使用匿名函数 绑定作用域
 */
export function delWarn (successCb, cancelCb, parama) {
  baseWarn('此操作将永久删除数据, 是否继续?', successCb, cancelCb, parama)
}

/**
 * 弹窗关闭提醒
 * @param successCb 确定回调
 * @param cancelCb  取消回调
 * @param parama 参数
 */
export function windowCloseWarn (successCb, cancelCb, parama) {
  baseWarn('数据已修改, 是否离开?', successCb, cancelCb, parama)
}
