<template>
    <el-table
      :data="data"
      ref="elTable"
      v-on="$listeners"
      @selection-change="handleSelectionChange"
      v-bind="$attrs">
      <template v-for="(col, index) in filterColumns">
        <!-- 出现二级表头-->
        <el-table-column
          v-if="col.type === 'column'"
          v-bind="col"
          :key="col.prop + col.label"
        >
          <template  v-for="(item,index) in col.columns">
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
</template>
<script>
  /**
   *  真假hidden 是否展示字段
   */
  export default {
    name: 'WpElTable',
    components: { },
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
      }
    },
    computed: {
      filterColumns () {
        return this.columns.filter(col => !col.hidden)
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.$emit('selectionChange', val)
      }
    }
  }
</script>
<style scoped lang="scss">
  /*.table {*/
  /*     display: flex;*/
  /*     flex-direction: column;*/
  /*     height: 100%;*/
  /*     width: 100%;*/
  /*   }*/
</style>
