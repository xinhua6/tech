<template>
  <div class="pager">
    <el-pagination
      background
      layout="sizes, prev, pager,total, jumper, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSize"
      :page-size="limit"
      :total="total">
    </el-pagination>
    <div class="c-cp" @click="refresh">
      <i class="el-icon-refresh" title="刷新"></i>
    </div>

  </div>
</template>

<script>
  import { PAGE_SIZE } from 'src/config/index'

  export default {
    name: 'WpPager',
    data () {
      return {
        pageSize: PAGE_SIZE,
        oldPage: null // 记录点击当前页数
      }
    },
    props: {
      total: [Number],
      page: {
        type: Number,
        default: 1
      },
      limit: {
        type: Number,
        default: 10
      }
    },
    methods: {
      handleSizeChange (val) {
        this.$emit('page-change', { limit: val })
      },
      handleCurrentChange (val) {
        this.$emit('page-change', { page: val })
      },
      refresh () {
        this.$emit('page-change', { refresh: true })
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped>
  .pager {
    padding: 5px;
    background: #fff;
    display: flex;
    align-items: center;
  }
</style>
