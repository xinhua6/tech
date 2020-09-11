<!--使用全局table，带有pager，常规操作-->
<template>
  <div class="c-h100">
    <wp-table :columns="columns"
              :data="tableData"
              :total="total"
              class="table"
              v-bind="$attrs"
              :page="ajaxData.page"
              @sort-change="changeTableSort"
              @page-change="pageChange"
              v-loading="loading">
      <!--操作-->
      <template slot="action" slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <i class="el-icon-edit-outline c-cp" @click="editDetail(scope.row)"></i>
        </el-tooltip>
        <!--删除-->
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <i class="el-icon-delete c-cp" @click="deleteList(scope.row)"></i>
        </el-tooltip>
      </template>
    </wp-table>
  </div>
</template>

<script>
  import actionMixin from '../axios/action-mixin'
  export default {
    name: "table01",
    mixins: [actionMixin],
    data() {
      return {
        columns: [
          {
            label: '序号',
            prop: 'index',
            type: 'index'
          },
          {
            label: '合同名称',
            prop: 'name'
          },
          {
            label: '合同编号',
            prop: 'number',
            sortable: 'custom',
            sortOrders: ['descending', null],
            renderHeader: this.renderHeader
          },
          {
            label: '合同类别',
            prop: 'typeName',
            align: 'center',
            width: '300'
          },
          {
            label: '操作',
            prop: 'action',
            width: '100',
            align: 'center'
          }
        ],
        baseUrl: '/reqtable/table01',
        tableData: [],
        total: 0,
        ajaxData: {
          page: 1,
          limit: 10,
          // 数据排序
          orderBy: null
        },
        currentPage: null,
        loading: false
      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.getData()
    },
    methods: {
      // 选择指定列进行排序
      changeTableSort ({ column, prop, order }) {
        console.log(column, prop, order)
        if (prop === 'number') {
          // 按照降序排序
          if (order === 'descending') {
            this.ajaxData.orderBy = 1
            this.getData()
            // 图标高亮
            document.getElementsByClassName('el-icon-caret-bottom')[0].className += ' s-c'
          } else {
            this.ajaxData.orderBy = null
            this.getData()
            document.getElementsByClassName('el-icon-caret-bottom')[0].classList.remove('s-c')
          }
        }
      },
      //  修改表头筛选图标
      renderHeader (h, { column, $index }) {
        if (column.property === 'number' && this.ajaxData.projId) {
          return h('span', {}, [
              h('span', {}, column.label),
              h('i', { class: 'el-icon-caret-bottom' })
            ]
          )
        } else if (column.property === 'number') {
          return h('span', {}, [
            h('span', {}, column.label)]
          )
        }
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
          this.tableData = res.data
        })
      },
      editDetail(row) {
        console.log(row,'edit')
      },
      deleteList(row) {
        console.log(row,'delete')
      }
    }

  }
</script>

<style scoped>

</style>