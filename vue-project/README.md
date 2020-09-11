# vue-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


# 文件结构
-- src
    --assets 公用icon或者图像，项目开发中并不是所需的icon在element-ui都有，所以需要进行存储
    --components 二次封装组件，并不是每个人模块都需要，例如地图，文件目录，横道图
    --global 全局公用组件，每个模块都会用到，例如table，form，axios请求
    --mock 开发数据测试
    --modules 每个业务模块
    --router 路由
    --store 全局公用的vuex ，例如用户信息userInfo
    --style 全局渲染的公用样式，例如将系统的字体大小，颜色等设为全局变量，flex布局简写
    --utils 常用的辅助函数，例如防抖函数，节流函数，日期标准化等
    --views 存储登录，登录报错重定向，刷新的页面
--test 单元测试
--build webpack配置