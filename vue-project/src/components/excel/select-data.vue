<template>
  <wp-window
             width="1000px"
             height="500px"
             :title="title"
             @on-closed="closeWin">
    <div class="c-fd_c c-h100" v-loading="loading">
      <div class="c-flex1 c-h100">
        <!-- 设置列 -->
        <el-radio-group v-model="params.selectRadio" v-if="!selectType" class="radio">
          <el-radio :label="item.fieldName" v-for="(item,index) in radioData" :key="index" :disabled="item.disable">{{item.remark}}</el-radio>
        </el-radio-group>
        <!-- 设置行 -->
        <div v-else>
          <div class="c-flex1 c-tvc">
            <el-transfer
              class="c-w100 transfer c-tvc"
              v-model="selectProj"
              :props="{
                key: 'projId',
                label: 'projName'
              }"
              :titles="['未选定项目', '已选定项目']"
              :data="projList"
              @change="changeRowData"
            >
            </el-transfer>
          </div>
        </div>
      </div>
      <detail-btn :actions="actions"></detail-btn>
    </div>
  </wp-window>
</template>

<script>
  export default {
    name: 'select-data',
    components: {},
    data () {
      return {
        loading: false,
        isSearch: false,
        ajaxData: {
          projName: null,
          projTypeid: null,
          monitor: null,
          manageLeader: null,
          page: 0
        },
        allProj: [],
        allSelectProj: [],
        selectProj: [],// 只存储projId
        selectProjList: [], // 存储的是对象
        params: {
          selectRadio: null
        },
        // 已设置关联的列数据
        selectCol: [],
        // 已设置关联的行数据
        selectRow: [],
        selectText: [],
        radioData: [
            {
              fieldName: 'index',
              remark: '序号',
              disable: false
            },
            {
              fieldName: 'projName',
              remark: '项目名称',
              disable: false
            },
            {
              fieldName: 'projCont',
              remark: '项目概况',
              disable: false
            },
            {
              fieldName: 'projInvestment',
              remark: '项目总投资（万元）',
              disable: false
            },
            {
              fieldName: 'agentInvest',
              remark: '代建投资（万元）',
              disable: false
            },
            {
              fieldName: 'projDate',
              remark: '工期计划',
              disable: false
            },
            {
              fieldName: 'sumRate',
              remark: '项目总累计完成投资（万元）',
              disable: false
            },
            {
              fieldName: 'rateAll',
              remark: '项目总累计完成百分比（%）',
              disable: false
            },
            {
              fieldName: 'planYearInfo',
              remark: '年度计划-节点计划',
              disable: false
            },
            {
              fieldName: 'sumY',
              remark: '年度计划-计划投资（万元）',
              disable: false
            },
            {
              fieldName: 'sumyAll',
              remark: '年度计划-小计',
              disable: false
            },
            {
              fieldName: 'progInfo',
              remark: '年度最新进展情况-项目进展情况',
              disable: false
            },
            {
              fieldName: 'sumM',
              remark: '年度最新进展情况-部门年度累计完成投资（万元）',
              disable: false
            },
            {
              fieldName: 'summAll',
              remark: '年度最新进展情况-年度累计完成投资（万元）',
              disable: false
            },
            {
              fieldName: 'rateM',
              remark: '年度最新进展情况-年度累计完成百分比（%）',
              disable: false
            },
            {
              fieldName: 'tiqian',
              remark: '年度计划推进情况-提前',
              disable: false
            },
            {
              fieldName: 'progress',
              remark: '年度计划推进情况-按计划推进',
              disable: false
            },
            {
              fieldName: 'zhihou',
              remark: '年度计划推进情况-滞后',
              disable: false
            },
            {
              fieldName: 'planInfo',
              remark: '下月节点计划',
              disable: false
            },
            {
              remark: '存在问题及建议',
              fieldName: 'issueSuggest',
              disable: false
            },
            {
              remark: '业主单位',
              fieldName: 'monitor',
              disable: false
            },
            {
              remark: '项目负责人',
              fieldName: 'leaderName',
              disable: false
            },
            {
              remark: '部门',
              fieldName: 'deptName',
              disable: false
            },
            {
              remark: '建设阶段',
              fieldName: 'projTypename',
              disable: false
            },
            {
              remark: '开工情况',
              fieldName: 'isStart',
              disable: false
            },
            {
              remark: '滞后原因',
              fieldName: 'lagReason',
              disable: false
            },
            {
              remark: '存在问题描述',
              fieldName: 'issueInfo',
              disable: false
            },
            {
              remark: '解决建议',
              fieldName: 'suggest',
              disable: false
            },
            {
              remark: '问题涉及部门',
              fieldName: 'dealDeptName',
              disable: false
            }
          ],
        copyColData: [],
      }
    },
    computed: {
      title () {
        if (!this.selectType) {
          return '设置关联列'
        } else {
          return '设置关联行'
        }
      },
      actions () {
        if (!this.selectType) {
          return [
            {
              name: 'sign',
              label: '设置关联列',
              type: 'primary',
              click: this.signCol
            },
            {
              name: 'cancel',
              label: '取消关联列',
              type: 'primary',
              click: this.delCol
            },
            {
              name: 'delete',
              label: '清除关联列',
              type: 'primary',
              click: this.delAllCol
            },
            {
              name: 'cancel',
              label: '取消',
              click: this.closeWin
            }
          ]
        } else {
          return [
            {
              name: 'sign',
              label: '关联项目',
              type: 'primary',
              click: this.signRow
            },
            {
              name: 'cancel',
              label: '取消关联',
              type: 'primary',
              click: this.delRow
            },
            {
              name: 'delete',
              label: '清除关联',
              type: 'primary',
              click: this.delAllRow
            },
            {
              name: 'cancel',
              label: '取消',
              click: this.closeWin
            }
          ]
        }
      },
      projType () {
        return [
          {
            label: '全部建设阶段',
            value: null
          }
        ].concat(PROJTYPE)
      },
      projList() {
        // 取差集
        return [...this.allProj].filter(x => [...this.recordProj].every(y => y !== x.projId))
      },
      recordProj() {
      //  记录当前行之前选过的项目
        let recordList = []
        this.selectRow.forEach((item,index)=> {
          if (item.colsX !==  this.axis[0]) {
            recordList.push(...item.fieldValue)
          }
        })
        return recordList
      }
    },
    props: {
      // 0表示关联列，1表示关联行
      selectType: {
        type: Number
      },
      // 所选的横纵坐标
      axis: {
        type: Array
      },
      // 已设置关联列和行的数据
      rowCol: Object,
      isHide: Boolean
    },
    watch: {
      rowCol: {
        handler(val) {
          this.selectCol = val.col
          this.selectRow = val.row
          this.editColStyle()
        },
        deep: true
      },
      isHide: {
        handler(val) {
          if (!val && this.selectType) {
            let item = this.rowCol['row'].find(item => item.colsX === this.axis[0])
            if (item && 'fieldValue' in item){
              this.selectProj = item.fieldValue
            }
          } else {
            this.selectProj = []
          }
        },
        immediate: true
      },
      selectType: {
        handler(val) {
          if (val) {
            this.getData()
          }
        }
      }
    },

    created () {
    },
    mounted () {
      // 列数据备份
      this.copyColData = JSON.parse(JSON.stringify(this.radioData))
    },
    methods: {
      closeWin () {
        this.$emit('close')
      },

      search() {
        this.isSearch = true
        // 将所选项目存储
        this.selectProjList = []
        for (let item of this.allProj) {
          for (let ele of this.selectProj) {
            if (item.projId === ele && !this.selectProjList.some(item => item.projId === ele)) {
              this.selectProjList.push(item)
            }
          }
        }
        this.getData()
      },

      // 请求项目列表
      getData () {
        // debugger
        this.$axios({
          loadingVm: this,
          method: 'get',
          // url: 'HMS/baseproject/proj/findbyprops',
          url: '/HMS-DATA/proj_query',
          params: {
            buildId: 33383,
            ...this.ajaxData
          }
        }).then((res)=> {
          this.allProj = []
          if (this.isSearch) {
            // allproj是筛选结果与已选的并集
            let data = res.data.map(item=> {
              return {
                projId: item.projId,
                projName: item.projName
              }
            })
            for (let item of data) {
              if (!this.selectProjList.some(ele => ele.projId === item.projId)) {
                this.allProj.push(item)
              }
            }
            this.allProj = this.allProj.concat(this.selectProjList)
            this.isSearch = false
          } else {
            this.allProj = res.data.map(item=> {
              return {
                projId: item.projId,
                projName: item.projName
              }
            })
          }

        })
      },
      // 设置关联列
      signCol () {
        if (this.selectCol.some(item => item.colsX === this.axis[0] && item.colsY === this.axis[1])) {
          this.selectCol.find(item => item.colsX === this.axis[0] && item.colsY === this.axis[1]).fieldName = this.params.selectRadio
        } else {
          this.selectCol.push({
            colsX: this.axis[0],
            colsY: this.axis[1],
            fieldName: this.params.selectRadio
          })
        }
        this.$emit('insert', this.selectCol,'addCol')
        this.params.selectRadio = null
        this.closeWin()
      },

      // 编辑表头样式
      editColStyle() {
        // 当前只是设置前26列
        this.radioData.forEach((item,index) => {
          item.disable = false
          item.remark = this.copyColData[index].remark
        })
        if (!this.rowCol['col'].length) return
        for (let i in this.rowCol['col']) {
          let ele = this.rowCol['col'][i]
          this.radioData.forEach((item,index) => {
            if (item.fieldName === ele.fieldName) {
              let head = this.setHead(ele.colsY)
              item.remark = '['+ head+ ']' + this.copyColData[index].remark
              item.disable = true
            }
          })
        }
      },

      // 设置头部字母超过26个后
      setHead(j){
        var index = null
        if (j < 26) {
          index = `${String.fromCharCode(Number(j)+65)}`
        } else {
          let num = Math.floor(j / 25)
          let ceil = j % 25
          index = String.fromCharCode(num-1+65) + String.fromCharCode(ceil-1+65)
        }
        return index
      },

      // 清除关联列
      delCol () {
        // 发现相同位置删除数据
        for (let i in this.selectCol) {
          if (this.selectCol[i].colsX === this.axis[0] && this.selectCol[i].colsY === this.axis[1]) {
            // let oldData = this.selectCol[i].fieldName
            // this.radioData.find(item => item.fieldName === oldData).disable = false
            this.selectCol.splice(i,1)
          }
        }
        this.params.selectRadio = null
        this.$emit('insert', this.selectCol,'delCol')
        this.closeWin()
      },
      // 清除全部关联列
      delAllCol () {
        this.selectCol = []
        this.$emit('insert', this.selectCol,'delAllCol')
        this.closeWin()
      },
      // 设置关联行
      signRow () {
        this.selectText = []
        // 发现相同位置删除数据
        for (let i in this.selectRow) {
          if (this.selectRow[i].colsX === this.axis[0] && this.selectRow[i].colsY === this.axis[1]) {
            this.selectRow.splice(i,1)
          }
        }
        for (let ele of this.allProj) {
          this.selectProj.forEach((item,index) => {
            if (ele.projId == item) {
              this.selectText.push(ele.projName)
            }
          })
        }
        this.selectRow.push({
          colsX: this.axis[0],
          colsY: this.axis[1],
          fieldValue: this.selectProj,
          remark: this.selectText
        })
        this.$emit('insert', this.selectRow,'addRow')
        this.selectProj = []
        this.closeWin()
      },
      // 清除关联行同时清空整行数据
      delRow () {
        for (let i in this.selectRow) {
          if (this.selectRow[i].colsX === this.axis[0] && this.selectRow[i].colsY === this.axis[1]) {
            this.selectRow.splice(i,1)
          }
        }
        this.$emit('insert', this.selectRow, 'delRow')
        this.closeWin()
      },
      // 取消全部行的关联同时清空全部行的数据
      delAllRow () {
        this.selectRow = []
        this.$emit('insert', this.selectRow,'delAllRow')
        this.closeWin()
      },

      changeRowData(value,direct,changeArr) {
        console.log(value,direct,changeArr)
        // 如果发生左移,取差集；右移填入
        // debugger
        if (direct === 'left') {
          this.allSelectProj = [...this.allSelectProj].filter(x => changeArr.every(y => y !== x))
        } else {
          this.selectProj.forEach(item => {
            if (!this.allSelectProj.some(ele => ele === item)) {
              this.allSelectProj.push(item)
            }
          })
        }
      },
    },
    destroyed () {
    }
  }
</script>

<style lang="scss" scoped>
  .radio /deep/ .el-radio{
    width: 45%;
    height: 30px;
  }

  .select /deep/ .el-select {
    width: 50%;
    padding: 1% 2%;
  }

  .select /deep/ .search {
    width: 50%;
    padding: 1% 2%;
  }

  .transfer /deep/ .el-transfer-panel {
    width: 40%;
  }

  .transfer /deep/ .el-transfer-panel__item {
    display: block;
  }
</style>
