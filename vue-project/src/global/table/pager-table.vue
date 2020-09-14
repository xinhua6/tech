<template>
    <div class="table">
        <el-table
                class="xdh-table"
                height="100%"
                :data="data"
                v-on="$listeners"
                v-bind="$attrs"
                highlight-current-row
                @selection-change="handleSelectionChange"
                ref="table">
            <template v-for="(col, index) in filterColumns">
                <!-- 出现二级表头-->
                <el-table-column
                        v-if="col.type === 'column'"
                        v-bind="col"
                        :key="col.prop + col.label"
                >
                    <template v-for="(item,index) in col.columns">
                        <el-table-column
                                v-bind="item"
                                :key="item.prop + item.label">
                            <template slot-scope="scope">
                                <slot :name="item.prop || 'default'"
                                      :row="scope.row"
                                      :$index="scope.$index"
                                      :column="item"
                                      :columnIndex="index">
                                    <a v-if="item.click" @click="item.click(scope.row)" class="c-colunm-click c-cp">{{scope.row[item.prop]}}</a>
                                    <span v-else>{{scope.row[item.prop]}}</span>
                                </slot>
                            </template>

                        </el-table-column>
                    </template>
                </el-table-column>
                <!-- 定义 index、selection 类型的列-->
                <el-table-column v-else-if="col.type==='index' || col.type==='selection'"
                                 v-bind="col"
                                 :index="col.indexMethod || indexMethod"
                                 :key="col.type"
                ></el-table-column>

                <!-- 定义通用类型的列-->
                <el-table-column v-else
                                 v-bind="col"
                                 :key="col.prop + col.label"
                                 :sortable="col.sortable || false"
                                 :sort-orders="col.sortOrders"
                                 :render-header="col.renderHeader"
                >
                    <template slot-scope="scope"
                              v-if="!col.type">
                        <slot :name="col.prop || 'default'"
                              :row="scope.row"
                              :$index="scope.$index"
                              :column="col"
                              :columnIndex="index">
                            <a v-if="col.click" @click="col.click(scope.row)" class="c-colunm-click c-cp">{{scope.row[col.prop]}}</a>
                            <span v-else>{{scope.row[col.prop]}}</span>
                        </slot>
                    </template>
                </el-table-column>
            </template>
            <!--暴露 el-table append 插槽-->
            <slot slot="append" name="append"></slot>
            <!--暴露 el-table empty 插槽-->
            <slot slot="empty" name="empty"></slot>
        </el-table>
        <wp-pager @page-change="pageChange"
                  :total="total"
                  v-if="pager"
                  :limit="pageLimit"
                  :page="page"></wp-pager>
    </div>

</template>
<script>
  import { WpPager } from '../pager'

  /**
   * 带分页的表格 真假hidden 是否展示字段
   */
  export default {
    name: 'WpTable',
    components: { WpPager },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      pager: {
        type: Boolean,
        default: true
      },
      page: {
        type: Number,
        // required: true
      },
      total: {
        type: Number,
        required: true,
        default: 0
      },
      limit: Number
    },
    data () {
      return {
        tableLimit: 10
      }
    },
    computed: {
      filterColumns () {
        return this.columns.filter(col => !col.hidden)
      },
      pageLimit () {
        return this.limit || this.tableLimit
      }
    },
    methods: {
      pageChange (page) {
        this.$emit('page-change', page)
        if (page.limit) {
          this.tableLimit = page.limit
        }
      },
      indexMethod (index) {
        return this.pageLimit * (this.page - 1) + index + 1
      },
      handleSelectionChange(row){
        this.$emit('row-select',row)
      }
    }
  }
</script>
<style scoped>
    .table {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%
    }
</style>
