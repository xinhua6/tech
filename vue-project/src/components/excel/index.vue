<template>
  <div class="c-h100 c-fd_c" v-loading="loading">
    <div class="c-fd_r top">
      <el-button type="primary" size="mini" @click="importExcel">导入文件</el-button>
      <el-button type="primary" size="mini" @click="exportExcel">保存</el-button>
    </div>
    <excel ref="excel"  class="c-flex1"
           @selectRange="selectRange"
           @getOperate="getOperate"
           @getExcelStyle="getExcelStyle"
           @floatWindow="floatWindow"
           @initRelate="initRelate"
           :refresh="isfresh"
           :selectCol="selectCol"
    >
    </excel>
    <select-data v-show="!isHide"
                 :isHide="isHide"
                 :selectType="selectType"
                 @close="isHide=true"
                 @insert="insertData"
                 :axis="axis"
                 :rowCol="rowCol"
                 ref="selectData"
                 v-bind="$attrs"
    ></select-data>
  </div>
</template>

<script>
  import Excel from './excel'
  import SelectData from './select-data.vue'
  import { merge} from 'src/utils/util'
  import { API_URL} from 'src/config/index'
  import Axios from 'axios'

  export default {
    name: 'watch-detail',
    components: {
      Excel,
      SelectData
    },
    data () {
      return {
        isfresh: false,
        tableData: [],
        excelData: {},
        loading: false,
        isShow: false,
        isHide: true,
        // 0表示关联列，1表示关联行，起始必须先设置为0
        selectType: 0,
        // 记录所点击的横纵坐标
        axis: [],
        // 已设置的横轴纵轴关联项
        rowCol: {
          row: [],
          col: []
        },
        baseUrl: '',
        excelStyle: null,
        // 设置第几行自动关联
        rowIndex: 0
      }
    },
    watch: {
      rowCol: {
        handler() {

        }
      }
    },
    computed: {
      rowLen() {
        return this.excelStyle.rows.len ? this.excelStyle.rows.len : this.axis[2]
      },
      colLen() {
        return this.excelStyle.cols.len ? this.excelStyle.cols.len : this.axis[3]
      },
      selectCol() {
        let arr = []
        this.rowCol['col'].forEach(item => {
          arr.push(item.colsY)
        })
        return arr
      },
      projIds() {
        return this.rowCol['row'][this.rowCol['row'].length-1].fieldValue.toString()
      },

      uploadUrl() {
        return API_URL + '/upload'
      },
      importUrl() {
        return API_URL + '/import'
      }
    },
    created() {},
    mounted() {
      // 获取关联项
      this.getRelation()
    },
    methods: {
      // selection为一个数组，记录[row,col,rowEnd,colEnd]
      selectRange (selection) {
        this.axis = selection
        // 选中列头
        if (selection[0] === 0 && selection[2] === this.rowLen-1 && selection[1] === selection[3]) {
          this.isHide = false
          this.selectType = 0
        } else if (selection[0] === selection[2] && selection[1] === 0 && selection[3] === this.colLen - 1) {
          //  选中行头
          this.isHide = false
          this.selectType = 1
        } else {
          this.isHide = true
        }
      },


      // 选中数据插入到excel表中
      insertData (data, operate) {
        if (operate === 'addRow' || operate === 'addCol') {
          this.addData(data)
        } else {
          this.delData(data,operate)
        }
      },

      // 删除行或者列的数据,如果删除行数据需要同时删除tableData里对应数据
      delData(data,operate) {
        switch (operate) {
          case 'delRow':
            if (this.$refs.excel.initData.rows.hasOwnProperty(`${this.axis[0]}`)) {
              if (this.$refs.excel.initData.rows[`${this.axis[0]}`].hasOwnProperty('cells')) {
                for (let ele in this.$refs.excel.initData.rows[`${this.axis[0]}`]['cells']) {
                  this.$refs.excel.initData.rows[`${this.axis[0]}`]['cells'][ele]['text'] = ''
                }
              }
            }
            let projIds = this.rowCol['row'].find(item => item.colsX === this.axis[0]).fieldValue.toString()
            this.tableData = this.tableData.filter(ele => ele.projIds !== projIds)
            break;
          case 'delCol':
            for (let ele in this.$refs.excel.initData.rows) {
              if (this.$refs.excel.initData.rows[`${ele}`].cells.hasOwnProperty(`${this.axis[1]}`)) {
                this.$refs.excel.initData.rows[`${ele}`].cells[`${this.axis[1]}`].text = ''
              }
            }
            break;
          case 'delAllRow':
            // 清空所有设置关联行的数据
            for (let i in this.rowCol['row']) {
              let x = this.rowCol['row'][i].colsX
              if (this.$refs.excel.initData.rows.hasOwnProperty(x)) {
                if (this.$refs.excel.initData.rows[x].hasOwnProperty('cells')) {
                  for (let ele in this.$refs.excel.initData.rows[x]['cells']) {
                    this.$refs.excel.initData.rows[x]['cells'][ele]['text'] = ''
                  }
                }
              }
            }
            this.tableData = []
            break;
          case 'delAllCol':
            // 清空所有关联列的数据
            for (let i in this.rowCol['col']) {
              let y = this.rowCol['col'][i].colsY
              for (let j=0, time = 0; j < this.rowLen; j++,time++) {
                if (time > Object.keys(this.$refs.excel.initData.rows).length) break
                if (this.$refs.excel.initData.rows.hasOwnProperty(`${j}`)) {
                  if (this.$refs.excel.initData.rows[`${j}`].cells.hasOwnProperty(`${y}`)) {
                    this.$refs.excel.initData.rows[`${j}`].cells[`${y}`]['text'] = ''
                  }
                }
              }
            }
            break;
        }
        // 存储行数据
        if (!this.selectType) {
          this.rowCol['col'] = data
          // 列设置表头
        } else {
          this.rowCol['row'] = data
        }
      },

      // 将设置关联数据插入到对应单元格
      addData(data) {
        // 存储行数据
        var x,y,field,item
        if (!this.selectType) {
          this.rowCol['col'] = data
          // 列设置表头
        } else {
          this.rowCol['row'] = data
        }
        this.getData(this.selectType).then(_ => {
          if (this.selectType) {
            // 插入行
            let row = this.rowCol['row'].find(ele => ele.colsX === this.axis[0])
            x = row.colsX
            item = this.tableData.find(ele => ele.projIds === row.fieldValue.toString())
            for (let j in this.rowCol['col']) {
              //获取某个字段值
              field = this.rowCol['col'][j].fieldName
              y = this.rowCol['col'][j].colsY
              // 未有值时插入值，已有值是跟新值
              if (!this.$refs.excel.initData.rows.hasOwnProperty(x)) {
                this.$refs.excel.initData.rows[`${x}`] = {
                  cells: {}
                }
                this.$refs.excel.initData.rows[`${x}`].cells[`${y}`] = {
                  text: item && item[`${field}`] ? item[`${field}`] : ''
                }
              } else {
                if (!this.$refs.excel.initData.rows[`${x}`].cells.hasOwnProperty(y)) {
                  this.$refs.excel.initData.rows[`${x}`].cells[`${y}`] = {
                    text: ''
                  }
                }
                this.$refs.excel.initData.rows[`${x}`].cells[`${y}`].text = item && item[`${field}`] ? item[`${field}`] : ''
              }
            }
          } else {
            // 插入列
            for (let i in this.rowCol['row']) {
              // 找到相关的项目信息
              x = this.rowCol['row'][i].colsX
              item = this.tableData.find(ele => ele.projIds === this.rowCol['row'][i].fieldValue.toString())
              let col = this.rowCol['col'].find(ele => ele.colsY === this.axis[1])
              field = col.fieldName
              y = col.colsY
              // 未有值时插入值，已有值是跟新值
              if (!this.$refs.excel.initData.rows.hasOwnProperty(x)) {
                this.$refs.excel.initData.rows[`${x}`] = {
                  cells: {}
                }
                this.$refs.excel.initData.rows[`${x}`].cells[`${y}`] = {
                  text: item[`${field}`]
                }
              } else {
                if (!this.$refs.excel.initData.rows[`${x}`].cells.hasOwnProperty(y)) {
                  this.$refs.excel.initData.rows[`${x}`].cells[`${y}`] = {
                    text: ''
                  }
                }
                if (item[`${field}`]) {
                  this.$refs.excel.initData.rows[`${x}`].cells[`${y}`].text = item[`${field}`]
                }
              }
            }
          }
          this.isfresh = !this.isfresh
        })
      },

      // 新增或者删除行或者列
      getOperate (operate) {
        // 如果是删除行或者列，将设置的关联列和行删除
        // 如果是新增行或者列，将设置的关联列和行后移
        switch (operate) {
          case 'delete-row':
            this.handleData('row','delete')
            break;
          case 'delete-column':
            this.handleData('col','delete')
            break;
          case 'insert-row':
            this.handleData('row','insert')
            break;
          case 'insert-column':
            this.handleData('col','insert')
            break;
          default:
            break;
        }
      },

      // 右键删除和插入数据处理,注意删除可以是多行和多列的
      handleData (rowCol,operate) {
        let distanceX = this.axis[2] - this.axis[0] + 1
        let distanceY = this.axis[3] - this.axis[1] + 1
        if (operate === 'delete') {
          // 对于已设置关联的rowCol数组
          for (let i=this.rowCol[rowCol].length-1;i >= 0;i--) {
            let item = this.rowCol[rowCol][i]
            if (((item.colsX >= this.axis[0] && item.colsX <= this.axis[2]) && rowCol === 'row') || ((item.colsY >= this.axis[1] && item.colsY <= this.axis[3]) &&  rowCol === 'col')) {
              // 在删除范围内
              this.rowCol[rowCol].splice(i,1)
            } else if ((item.colsY < this.axis[1] && item.colsX === 0) || (item.colsX < this.axis[0] && item.colsY === 0)) {
              // 在删除范围前
            } else if ((item.colsY > this.axis[3] && item.colsX === 0) || (item.colsX > this.axis[2] && item.colsY === 0)) {
              // 在删除范围后
              rowCol === 'col' ? item.colsY = item.colsY - distanceY : item.colsX = item.colsX - distanceX
            }
          }
        } else {
          this.rowCol[rowCol].forEach((item,index) => {
            if ((item.colsY < this.axis[1] && item.colsX === 0 && rowCol === 'col') || (item.colsX < this.axis[0] && item.colsY === 0 && rowCol === 'row')) {
              // 在插入范围前
            } else {
              // 在插入范围后
              rowCol === 'col' ? item.colsY = item.colsY + 1 : item.colsX = item.colsX + 1
            }
          })
        }
      },

      // 获取表格的长宽
      getExcelStyle(data) {
        this.excelStyle = data
      },

      // 鼠标靠近关联行显示项目名称
      floatWindow(cellMsg, type) {
        // 悬浮设置的行项目
        let excel = document.getElementsByClassName('x-spreadsheet-overlayer')[0]
        var { colIndex,
        height,
        offetTop,
        offsetLeft,
        rowIndex,
        width} = cellMsg
        if (type === 'cellIn') {
          if (this.rowCol['row'].some(item => item.colsX === rowIndex)) {
            let content = "悬浮显示内容"
            let html = '<div class="hover-title" style="position: absolute; z-index: 6;left: 50px; border: 1px solid #000; background-color: white; '+'top:'+ `${offetTop-10}` +'px">' + content + '</div>'
            excel.insertAdjacentHTML('afterbegin',html)
          }
        } else {
          let dom = document.getElementsByClassName('hover-title')[0]
          if (dom) {
            dom.remove()
          }
        }
      },


      // 保存excel的编辑
      exportExcel() {
        // 跟新保存行数
        this.$refs.excel.initData.rows['len'] = this.rowLen
        this.$refs.excel.initData.cols['len'] = this.colLen
        // 保存关联项以及excel文件
        var rowData = this.rowCol['row'].map(item => {
          return {
            ...item,
            fieldValue: item.fieldValue.toString(),
            remark: item.remark.toString()
          }
        })
        this.$axios({
          method: 'post',
          url: this.baseUrl + '_saveAll',
          data: {
            kid: this.$route.query.kid,
            colsList: JSON.stringify(this.rowCol['col']),
            condList: JSON.stringify(rowData),
            initData: JSON.stringify(this.$refs.excel.initData)
          },
          loadingVm: this
        }).then(res => {
          let name = this.$route.query.rptName
          this.$refs.excel.exportExcel().then(blob => {
            this.saveFile(new window.File([blob], name + '.xlsx'))
            // this.saveFile(blob)
          })
        })
      },

      saveFile(file) {
        // 构造formData上传附件
        let param = new FormData()
        param.append('file', file)
        param.append('filename', this.$route.query.rptName)
        let config = {
          //添加请求头
          headers: {
            Authorization: sessionStorage.getItem('token')
          }
        }
        this.loading=true
        Axios.post(this.uploadUrl,param, config).then(res => {
          console.log(res)
          this.$message.success('保存成功')
        }).catch(res => {
        this.$message.error(res.msg)
        }).finally(() =>{
          this.loading = false
        })
      },

      // 获取关联行和列中单元格的内容
      getData(operate, val) {
        return new Promise(resolve => {
          // 插入行请求数据，插入列不请求数据
          if (operate == 0 || !this.projIds) {
            resolve()
            return
          }
          this.$axios({
            method: 'get',
            url: '/HMS-DATA/imisProjProgPlan_queryRelation',
            params: {
              planDate: this.$route.query.planDate.slice(0,10),
              projIds: val ||this.projIds
            },
            loadingVm: this
          }).then((res) => {
            // 返回数据动态插入到树的相应位置
            this.tableData.push(res.data)
            resolve(res.data)
          })
        })
      },

      // 获取关联项且将关联数据填入
      getRelation() {
        this.$axios({
          method: 'post',
          url: this.baseUrl + '_query_one',
          data: {
            kid: this.$route.query.kid,
          },
          loadingVm: this
        }).then(res => {
          if (`${res.data['initData']}` !== '{}'&& !!res.data['initData']) {
            merge(this.excelData,JSON.parse(`${res.data['initData']}`))
            this.$set(this.$refs.excel.initData,'cols',this.excelData.cols)
            this.$set(this.$refs.excel.initData,'merges',this.excelData.merges)
            this.$set(this.$refs.excel.initData,'rows',this.excelData.rows)
            this.$set(this.$refs.excel.initData,'styles',this.excelData.styles)
            this.$refs.excel.init()
          } else {
            this.$refs.excel.init().then(res => {
              this.importExcel()
            })
          }
          this.rowCol['col'] = res.data['colsList'] ? res.data['colsList'] : []
          if (res.data['condList'].length > 0) {
            this.rowCol['row'] = res.data['condList'].map(item => {
              return {
                ...item,
                remark: item.remark.split(','),
                fieldValue: item.fieldValue.split(',').map(ele => {
                  return Number(ele)
                })
              }
            })
            this.setTableData()
          }
          if (!res.data['colsList'].length > 0) {
            this.initRelate()
          }
          for (let item of this.rowCol['row']) {
            item['fieldValue'].forEach(ele => {
              this.$refs.selectData.allSelectProj.push(ele)
            })
          }
        })
      },


      // 获取已经设置关联项目的相关数据
      setTableData () {
        this.rowCol['row'].forEach(item => {
          this.getData(1,item.fieldValue.toString())
        })
      },

      // 导入文件
      importExcel() {
        let kid = this.$route.query.fileKid
        Axios.get(this.importUrl,{
          params: {
            kid: kid
          },
          headers: { 'Content-Type': 'application/json,charset=utf-8'},
          responseType: 'arraybuffer', //二进制流
        }).then((res) => {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel,charset=utf-8' })
          let file = new window.File([blob], this.$route.query.rptName)
          this.$refs.excel.importExcel(file)
        })
      },

      initRelate() {
        // 自动关联行属性
        let selectData = this.$refs.selectData.radioData
        if (this.$refs.excel.initData.rows.hasOwnProperty(this.rowIndex)) {
          if (this.$refs.excel.initData.rows[this.rowIndex].hasOwnProperty('cells')) {
            for (let ele in this.$refs.excel.initData.rows[this.rowIndex]['cells']) {
              let text = this.$refs.excel.initData.rows[this.rowIndex]['cells'][ele]['text']
              selectData.forEach((item,index) => {
                if (item.remark === text) {
                  this.rowCol['col'].push({
                    colsX: this.rowIndex,
                    colsY: Number(ele),
                    fieldName: item.fieldName
                  })
                }
              })
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .top {
    margin: 10px;
  }
  .title {
    font-size: 2rem;
  }
</style>
