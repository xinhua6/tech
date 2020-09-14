/**
 *  ajax请求模块, 底层调用axios发送请求
 *
 */
import axios from 'axios'
import { API_URL } from 'src/config'
import {
  requestSuccessFunc,
  requestFailFunc,
  responseSuccessFunc,
  responseFailFunc
} from './intercepeter'

/**
 * 取消请求
 * @type {CancelTokenSource}
 * @example
 *
 * import {source} from '@/utils/axios'
 * source.cancel('描述文字....')
 */
export const source = axios.CancelToken.source()

/**
 * Axios实例化参数选项对象
 * @const
 * @type {object}
 * @property {object} headers 请求头对象对象，默认：null
 * @property {number} timeout 超时时间，默认：0， 不限制
 * @property {boolean} withCredentials 是否带上验证信息， 默认：true
 * @property {number} maxContentLength 限制最大发送内容长度，默认：-1 不限制
 */
const config = {
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8'
  // },
  baseURL: API_URL,
  timeout: 0,
  withCredentials: false,
  responseType: 'json',
  maxContentLength: -1,
  cancelToken: source.token
}

const request = axios.create(config)

request.interceptors.request.use(requestSuccessFunc, requestFailFunc)

request.interceptors.response.use(responseSuccessFunc, responseFailFunc)

export default request
