# mock
在项目开发的过程中往往前端写完的时候后端还没有提供出来接口，这个时候我们可以先配置mock来模拟数据请求

#### 在vue项目中配置mock
1. 下载mockjs
```
npm i mockjs -S
```

2. 创建文件mock并在里面配置相应的请求  

 ![mock文件结构](../../image/web-font/mock.png)  

  mock.js中写请求
  ```javascript
import Mock from 'mockjs'
import virtual from './virtual'
const url = [
  {
    url: '/reqtable/table01_query',
    type: 'get',
    template: virtual.tableData01
  },
  {
    url: '',
    type: '',
    template: ''
  }
  ...
]
export function reqMockData(){
  for (let item of url) {
    Mock.mock(new RegExp(item.url),item.type, item.template)
  }
}
reqMockData()
```
  在virtual中存储虚拟数据
  ```javascript
  import Mock from 'mockjs'
  export default {
    tableData01: (req) => {
      return Mock.mock({
        'data': [
          {
            name: '合同一',
            number: 1,
            typeName: '类型一'
          },
          ...
        ],
        'success': true
      })
    },
    .....
  ```




3. 在main.js中引入mock文件  
```javascript
import '../mock/mock'
```
