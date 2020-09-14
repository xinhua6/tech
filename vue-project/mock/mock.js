import Mock from 'mockjs'
import virtual from './virtual'


const url = [
  {
    url: '/reqtable/table01_query',
    type: 'get',
    template: virtual.tableData01
  },
  {
    url: '/reqtable/table02_query',
    type: 'get',
    template: virtual.tableData02
  },
  {
    url: '/reqtable/table03_query',
    type: 'get',
    template: virtual.tableData03
  },
  {
    url: '/reqmenu/menu01',
    type: 'get',
    template: virtual.treeData01
  },
  {
    url: '',
    type: '',
    template: ''
  },
]

export function reqMockData(){
  for (let item of url) {
    Mock.mock(new RegExp(item.url),item.type, item.template)
  }
}

reqMockData()