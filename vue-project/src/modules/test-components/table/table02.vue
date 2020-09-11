<!--分阶段合计，固定首行，筛选字段功能-->
<template>
  <div class="c-h100">
    <sclc-table :columns="columns"
                :data="tableData"
                v-bind="$attrs"
                v-on="$listeners"
                stripe
                resizable
                ref="table"
                height="100%"
                :footer-method="getSummaries"
                class="c-flex1"
                highlight-current-row
                :tree-props="{isTreeGrid:true}"
    >
      <template v-slot:indexHeader>
        <span>序号</span>
        <el-popover
                placement="bottom"
                v-model="popoverShow"
                @show="showPopover"
                width="230"
                trigger="click">
          <div class="filter">
            <div v-for="item in filterList">
              <el-checkbox :key="item.label" v-model="filterMap[item.label]">{{item.label}}</el-checkbox>
            </div>
            <div class="filter-bottom">
              <el-button size="mini" @click="resetFilter">重置</el-button>
              <el-button size="mini" @click="setFilter">筛选</el-button>
            </div>
          </div>
          <i class="el-icon-arrow-down c-cp" slot="reference"></i>
        </el-popover>
      </template>
    </sclc-table>
  </div>
</template>

<script>
  import actionMixin from '../axios/action-mixin'
  import SclcTable from 'src/components/table/sclc-table'
  const PROJTYPE = [
    {
      label: '在建',
      value: 21
    }, {
      label: '筹建',
      value: 22
    }, {
      label: '完工待结算',
      value: 23
    }, {
      label: '缓建',
      value: 24
    }, {
      label: '结算待决算',
      value: 25
    }, {
      label: '已决算',
      value: 26
    }
  ]
  export default {
    name: "table02",
    components: {
      SclcTable
    },
    mixins: [actionMixin],
    data() {
      return {
        columns: [],
        filterList: [],
        showMap: {},
        filterMap: {},
        popoverShow: false,
        tableData: [],
        ajaxData: {
          projTypeid: null
        },
        projType: PROJTYPE,
        baseUrl: '/reqtable/table02'
      }
    },
    computed: {
      columnList() {
        return [
          {
            label: '序号',
            type: 'index',
            prop: 'index',
            align: 'center',
            fixed: 'left',
            width: 80,
            slotHead: 'indexHeader',
          },
          {
            label: '项目名称',
            prop: 'projName',
            width: 180,
            align: 'center',
            fixed: 'left',
          },
          {
            label: '代建投资（万元）',
            prop: 'agentInvest',
            width: 120,
            align: 'center'
          },
          {
            label: '计划完成投资额（万元）',
            prop: 'moneySum1',
            type: 'column',
            align: 'center',
            children: [
              {
                label: '招标代理费及代建费',
                prop: 'planZbdlf',
                width: 120,
                align: 'center'
              },
              {
                label: '建设项目前期工作费',
                prop: 'planQqgzf',
                width: 120,
                align: 'center'
              }
            ]
          },
          {
            label: '实际完成投资额（万元）',
            prop: 'moneySum2',
            type: 'column',
            align: 'center',
            children: [
              {
                label: '招标代理费及代建费',
                prop: 'planRecZbdlf',
                width: 120,
                align: 'center'
              },
              {
                label: '建设项目前期工作费',
                prop: 'planRecQqgzf',
                width: 120,
                align: 'center'
              }
            ]
          }
        ]
      }
    },
    watch: {},
    created() {
      this.resetFilter()
      this.filterList = this.columnList.filter(item => !item.fixed)
      this.setFilter()
    },
    mounted() {
      this.getData()
    },
    methods: {
      resetFilter () {
        const showMap = {}
        const filterMap = {}
        this.columnList.forEach(item => {
          showMap[item.label] = true
          filterMap[item.label] = true
        })
        this.showMap = showMap
        this.filterMap = filterMap
      },
      setFilter () {
        Object.keys(this.filterMap).forEach(key => { this.showMap[key] = this.filterMap[key] })
        this.columns = this.columnList.filter(col => this.showMap[col.label])
        this.popoverShow = false
      },
      showPopover () {
        Object.keys(this.showMap).forEach(key => { this.filterMap[key] = this.showMap[key] })
      },
      // 求和
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        let computed = ['projInvestment','agentInvest', 'planZbdlf','planQqgzf',
          'planRecZbdlf','planRecQqgzf'
        ]
        columns.forEach((column, index) => {
          if (column.type === 'index') {
            sums[index] = '合计'
          } else if (computed.some(ele => ele === column.prop)) {
            let sum = 0
            for (let ele of data) {
              let item = ele.children[ele.children.length-2]
              if (!isNaN(item[column.prop])) {
                sum += Number(item[column.prop])
              }
            }
            sums[index] = sum.toFixed(2)
          } else {
            sums[index] = ''
          }
        })
        console.log(sums)
        let percent = this.getPercent(sums,'array')
        return [sums,percent]
      },

      // 分阶段小计
      getSubTotal(data) {
        let computed = ['projInvestment','agentInvest','planZbdlf','planQqgzf','planRecZbdlf','planRecQqgzf']
        let sums = {}
        sums.index = '小计（万元）'
        for (let item of computed) {
          let sum = 0
          data.children.forEach(ele => {
            if (!isNaN(ele[item])) {
              sum += Number(ele[item])
            }
          })
          sums[item] = sum.toFixed(2)
        }
        data.children.push(sums)
        let subPercent = this.getPercent(sums)
        data.children.push(subPercent)
        return data
      },

      // 分阶段百分比
      getPercent(sums, type='Object') {
        let computed = ['planRecZbdlf','planRecQqgzf']
        let data = type === 'Object' ? {} : []
        if (type === 'Object') {
          for (let ele in sums) {
            if (computed.some(item => item === ele)) {
              // 实际/计划
              if (isNaN(Number(sums[ele])) || isNaN(Number(sums[ele.replace('Rec','')])) || !Number(sums[ele]) || !Number(sums[ele.replace('Rec','')])) {
                // debugger
                data[ele] = '0.00%'
              } else {
                data[ele] = ((sums[ele]/ sums[ele.replace('Rec','')])*100).toFixed(2) + '%'
              }
            } else if (ele === 'index') {
              data[ele] = '小计完成百分比（%）'
            } else {
              data[ele] = null
            }
          }
        }
        return data
      },

      getData() {
        this.$axios({
          method: 'get',
          url: this.baseUrl + '_query',
          params: {
            ...this.ajaxData
          },
          loadingVm:this
        }).then(res => {
          this.handleData(res.data)
        })
      },

      /*
    * 分阶段显示数据*/
      handleData(data) {
        this.tableData = []
        // 没有筛选项目阶段
        if (!this.ajaxData.projTypeid) {
          for (let i in this.projType) {
            data.forEach(item => {
              if (item.projTypeid === this.projType[i].value) {
                if (this.tableData.length && this.tableData.some(ele => ele['name'] === this.projType[i].label)) {
                  this.tableData.find(ele => ele['name'] === this.projType[i].label).children.push({
                    ...item
                  })
                } else {
                  this.tableData.push({
                    name: this.projType[i].label,
                    children: [{...item}],
                    index: Number(i) + 1,
                    kid: Number(i) + 1
                  })
                }
              }
            })
          }
        } else {
          let name = this.projType.find(item => item.value === this.ajaxData.projTypeid).label
          this.tableData.push({
            name: name,
            children: []
          })
          data.forEach(item => {
            this.tableData[0].children.push({
              ...item
            })
          })
        }
        for (let ele of this.tableData) {
          ele.children.forEach((item,index) => {
            item['index'] = index + 1
          })
          // 分阶段小计
          if (this.getSubTotal) {
            ele = this.getSubTotal(ele)
          }
        }
      }
    }

  }
</script>

<style scoped>

</style>