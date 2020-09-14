/**
 *  ajax请求模块, 底层调用axios发送请求
 *   参考新德汇ajax修改，除去socket，修改默认参数编码方式,与缓存机制的实现，添加更新缓存
 *
 */

/** TODO 封装的loading vm cache isJson cutomError等配置暂不支持ajax 0.19（目前最新） 以上的版本
 *
 * 因为其修改了mergeConfig的显示，只保留其提供的配置
 *  如需 可通过重新生成一个promise对象实现，不通过interceptor
 */

import Vue from 'vue'
import qs from 'qs'
import axios from 'axios'
import { get, save, LOCAL, SESSION } from 'src/utils/storage'

// 内存缓存数据保存处
const Caches = Object.create(null)

/** config 自定义配置
 *  cache, // boolean/Object, Object: {local, session, key}
 *          local:Boolean 数据是否保存到localStorage，
 *          session:Boolean 数据是否保存到SessionStorage
 *          update:Boolean ,true 更新缓存
 *          key：缓存的key，默认取url+query
 *          time: Number 毫秒数 缓存时长
 *  isJson 配置参数是否为 application/
 *  编码
 *
 *  customError 是否自行处理后台返回fasle的情况
 */

/**
 * 请求前拦截
 */
export function requestSuccessFunc (config) {
  const type = config.method.toLowerCase()
  // 默认使用 application/x-www-form-urlencoded 编码
  if (type === 'post' && !config.isJson) {
    config.data = qs.stringify(config.data, { skipNulls: true })
  }
  // 自定义权限
  if (!config._ignore) {
    config.headers.common.Authorization = sessionStorage.getItem('token')
  }
  if (type !== 'options') {
    if (config.delPending) cancelHandle(config)
    if (config.cache) cacheAdapter(config)
  }
  loadingHandle(config, true)
  return config
}

export function requestFailFunc (requestError) {
  // 自定义发送请求失败逻辑
  console.error('请求失败，这是什么情况?', requestError)
  loadingHandle(requestError.config, false)
  return Promise.reject(requestError)
}

/**
 * 请求结果预处理
 * @param response
 * @returns {Promise<never>}
 */
export function responseSuccessFunc (response) {
  // 200 success 字段可根据后台配置
  const res = response.data
  loadingHandle(response.config, false)
  removeCancelToken(response.config)
  if (res && res.success) {
    const cache = response.config.cache
    if (cache && !cache.cached) {
      cache.cached = true
      saveCache(cache.key, response, cache.local ? LOCAL : (cache.session ? SESSION : null), cache.time)
    }
    if (res.data === null) {
      res.data = []
    }
    return res
  } else if (!response.config.customError) {
    Vue.prototype.$message.warning(res.msg)
    return Promise.reject(res)
  } else {
    return res
  }
}

export function responseFailFunc (resError) {
  if (axios.isCancel(resError)) {
    if (process.env.NODE_ENV === 'development') {
      console.log('请求取消', resError)
    }
    return Promise.reject(resError)
  }

  const status = resError.response && resError.response.status
  const config = resError.config
  if (config) {
    loadingHandle(config, false)
    if (config.delPending) removeCancelToken(config)
  }
  // 用于正在升级显示
  if (status === 504) {
    Vue._isUpdate = true
    window.location.hash = '/refresh'
  }

  // 登录超时
  if (status === 401) {
    sessionStorage.clear()
    window.location.reload()
    return
  }
  if (process.env.NODE_ENV === 'development') {
    if (resError.config && resError.config.customError) {
      return Promise.reject(resError)
    }
    let msg = ''
    const url = resError.config && resError.config.url
    if (resError.message.indexOf('timeout') !== -1) {
      msg = '请求超时,时长：' + resError.config.timeout + '毫秒'
    }
    if (resError.message.indexOf('Network Error') !== -1) {
      msg = '未连接到互联网，请检查网络是否畅通'
    }
    if (status >= 500) {
      msg = '后台服务器异常'
    }
    if (status < 500 && status >= 400) {
      msg = '请求异常异常，前检查请求参数或请求地址是否正确'
    }
    Vue.prototype.$message.error(msg)
    console.error(url + '-------------' + msg)
  }
  return Promise.reject(resError)
}

/**
 * 获取、更新缓存数据
 * @param config
 *
 */
function cacheAdapter (config) {
  if (typeof config.cache !== 'object') {
    config.cache = {}
  }
  config.cache = { key: createKey(config.url, config.method, config.params, config.data), ...config.cache }
  let cacheData
  let cache = config.cache
  if (cache.key) {
    const storage = cache.local ? LOCAL : (cache.session ? SESSION : null)
    cacheData = cache.update ? removeCache(cache.key, storage) : getCache(cache.key, storage)
  }
  if (cacheData) {
    config.adapter = function (config) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          if (process.env.NODE_ENV === 'development') {
            console.log('缓存数据读取', cacheData.config.url,cacheData.data)
          }
          loadingHandle(config, false)
          resolve(cacheData)
        }, 100)
      })
    }
  }
}

/**
 * 创建缓存key, 由请求url、类型、参数、发送数据构成的标识符
 * @param {string} url 请求url
 * @param {string} type 请求类型
 * @param {object} params url参数对象
 * @param {object} data 请求数据
 * @return {string}
 */
function createKey (url, type, params, data) {
  return encodeURIComponent([url, type, JSON.stringify(params), JSON.stringify(data)].join(','))
}

/**
 * 获取缓存
 * @param {string} key 缓存key
 * @param {Storage} storage 保存缓存方式，localStorage/sessionStorage/null
 * @return {String|Object|Array}
 */
function getCache (key, storage) {
  const cache = storage ? get(key, storage) : Caches[key]
  return cache && (!cache.expiresTime || Date.now() < cache.expiresTime) ? cache.data : null
}

/**
 * 删除缓存, 删除包含url的缓存
 * @param {string} url 缓存key包含的值
 * @param {Storage} storage 保存缓存方式，localStorage/sessionStorage/null
 *
 */
function removeCache (url, storage) {
  if (storage) {
    for (var i = 0, len = storage.length; i < len; i++) {
      const key = storage.key(i)
      key.includes(url) && storage.removeItem(key)
    }
  } else {
    for (let key in Caches) {
      key.includes(url) && delete Caches[key]
    }
  }
  return null
}

/**
 * 写入缓存
 * @param {string} key 缓存key
 * @param {Object|Array} data 写入数据
 * @param {Storage} storage 保存缓存方式，localStorage/sessionStorage/null
 * @param {Number} 缓存时长
 */
function saveCache (key, data, storage, cacheTime = 0) {
  const saveData = { expiresTime: cacheTime ? Date.now() + cacheTime : false, data }
  if (storage) {
    save(key, saveData, storage)
  } else {
    Caches[key] = saveData
  }
}

/**
 * 自动设置请求loading效果
 * @param config 请求配置
 * @param isLoading loading所在组件的实例  组件属性名为loading 如需其他属性值,应组件内自行调用
 */
function loadingHandle (config, isLoading) {
  if (process.env.NODE_ENV === 'development') {
    if (config.loadingVm && !(config.loadingVm instanceof Vue)) {
      console.error('loadingVm配置为当前组件实例')
      return
    }
  }
  if (config.loadingVm) {
    config.loadingVm.loading = isLoading
    // cache时内存泄露
    if (!isLoading) {
      delete config.loadingVm
    }
  }
}

const CANCEL_MAP = Object.create(null)

function removeCancelToken (config) {
  const url = config.url.replace(config.baseURL, '')
  const source = CANCEL_MAP[url]
  if (source && source.key === config.cancelToken) {
    delete CANCEL_MAP[url]
  }
}

// 取消接口相同参数不同的处于pending状态下的请求
function cancelHandle (config) {
  if (process.env.NODE_ENV === 'devlopment') {
    if (config.loadingVm) {
      // 取消请求的接口不能使用loadingVm，因为 resError 不包含config
      console.error('delPending 暂时不能与LoadingVm 或 cache 同时使用')
      return
    }
  }
  const url = config.url
  if (CANCEL_MAP[url]) {
    CANCEL_MAP[url].source.cancel()
  }
  const source = new axios.CancelToken.source()
  config.cancelToken = source.token
  CANCEL_MAP[url] = {
    source: source,
    key: source.token
  }
}
