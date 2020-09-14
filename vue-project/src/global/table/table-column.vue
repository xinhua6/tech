<template>
  <el-table-column>
    <template v-if="column.columns && column.columns.length">
      <table-column :columns="children" v-for="children in columns" :key="children.prop + children.label"></table-column>
    </template>
    <template slot-scope="scope" v-else>
      <slot :name="column.prop || 'default'"
            :row="scope.row"
            :$index="scope.$index"
            :column="column">
        <a v-if="column.click"
           @click="column.click(scope.row)"
           class="c-colunm-click c-cp">
          {{scope.row[column.prop]}}
        </a>
        <span v-else>{{scope.row[column.prop]}}</span>
      </slot>
    </template>
  </el-table-column>
</template>
<script>
  export default {
    name: 'table-column',
    props: {
      column: {
        default () { return {} }
      }
    }
  }
</script>
