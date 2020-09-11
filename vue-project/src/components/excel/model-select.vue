<template>
  <wp-window :isClosed="false" title="选择报表模板" @on-closed="cancel">
    <table-view style="padding-top: -10px" @rowClick="rowClick"></table-view>
    <div style="position: absolute;right: 10px;bottom: 10px">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </wp-window>
</template>
<script>
  import TableView from './table-view.vue'

  export default {
    components: { TableView },
    data () {
      return {
        row: null
      }
    },
    methods: {
      rowClick (row) {
        this.row = row
      },
      cancel () {
        this.$emit('close')
      },
      confirm () {
        if (!this.row) {
          this.$message.error('请选择一条数据')
          return
        }
        this.$emit('select', this.row)
        this.cancel()
      }
    }

  }
</script>
