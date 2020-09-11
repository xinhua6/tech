const STATIC_CONFIG = window.__config__ || {}

// 请求的基本url  不加斜杠
export const API_URL = STATIC_CONFIG.API_URL || 'http://192.168.1.21:8067'

export const LOGIN_PATH = STATIC_CONFIG.LOGIN_PATH || '/login'

export const REFRESH = '/refresh'

export const SYS_ZH_NAME = STATIC_CONFIG.SYS_ZH_NAME || '测试项目'

// 主系统名称
export const SYS_NAME = 'test'

export const PAGE_SIZE = [5, 10, 15, 20, 50]

export const MAP_CENTER = [113.390465, 22.943853]

export const DEFAULT_DB_NAME = 'imis'
