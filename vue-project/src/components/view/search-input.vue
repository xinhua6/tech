<template>
  <el-input
    :size="size"
    v-bind="$attrs"
    :value="value"
    v-on="$listeners"
    class="search"
    @keyup.enter.native="searchData">
    <i slot="prepend" class="el-icon-search" @click="searchData"></i>
  </el-input>
</template>

<script>
  export default {
    name: 'search-input',
    props: {
      value: {
        required: true
      },
      size: {
        type: String,
        default: 'mini'
      }
    },
    created() {
    },
    methods: {
      searchData (e) {
        this.$emit('search')
        e.preventDefault()
      }
    }
  }
</script>

<style scoped lang="scss">
  .search {
    margin: 1rem;
    width: auto;

    /deep/ .el-input-group__prepend {
      background-color: #fff;
      cursor: pointer;
      .el-input__inner {
        border-left: 0;
      }
    }
  }
</style>
