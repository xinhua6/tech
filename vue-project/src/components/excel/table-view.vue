<template>
    <div class="c-h100 c-fd_c">
        <div class="head c-fd_r">
          <search-input @search="search" placeholder="搜索" v-model="ajaxData.name"></search-input>
        </div>
        <wp-table class="c-flex1"
                  :columns="columns"
                  :data="tableData"
                  :total="total"
                  v-bind="$attrs"
                  v-on="$listeners"
                  :page="ajaxData.page"
                  @page-change="pageChange"
                  v-loading="loading"
                  @row-click="clickRow"
        >
        </wp-table>
    </div>
</template>

<script>
  import SearchInput from 'src/common/components/view/search-input'

  export default {
    name: 'TableView',
    components: { SearchInput },
    props: {},
    data () {
      return {
        loading: false,
        isClosed: true,
        total: 0,
        ajaxData: {
          page: 1,
          limit: 10,
          name: null
        },
        tableData: [],
        url: '/HMS-DATA/imisSupvReportTmp',
        columns: [
          {
            label: '序号',
            prop: 'index',
            type: 'index'
          },
          {
            label: '模板名称',
            prop: 'name'
          },
          {
            label: '填报人',
            prop: 'addUserName'
          },
          {
            label: '填报时间',
            prop: 'addDate',
            align: 'center',
            width: '150'
          }
        ],
      }
    },
    computed: {
    },
    created () {
      this.getData()
    },
    activated () {
      this.getData()
    },
    methods: {
      getData () {
        this.$axios({
          url: this.url + '_query',
          loadingVm: this,
          params: {
            ...this.ajaxData
          }
        }).then(res => {
          this.tableData = res.data.map(item => {
            return {
              ...item,
              addDate: item.addDate.slice(0,10)
            }
          })
          this.total = res.total
        })
      },
      pageChange (pageMsg) {
        this.ajaxData.page = pageMsg.page
        this.currentPage = pageMsg.page
        if (pageMsg.limit || pageMsg.refresh) {
          this.ajaxData.limit = pageMsg.limit || this.ajaxData.limit
          this.ajaxData.page = 1
          // this.currentPage = 1
        }
        this.getData()
      },
      clickRow (row, column) {
        if (row) {
          this.$emit('rowClick',row)
        }
      },
      search() {
        this.ajaxData.page = 1
        this.getData()
      }
    }
  }
</script>

<style scoped>
    .head {
        margin: 10px;
    }

    .icon {
        cursor: pointer;
        font-size: 1.6rem;
        margin: 0 5px;
    }
</style>
