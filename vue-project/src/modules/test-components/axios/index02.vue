<!--封装增删改查-->
<template>
  <div class="c-h100">
     <pre>
       在detail-mixin.js中封装好各个模块的对于form表单的增改，
       在action-mixin.js中封装好对于table的查删以及分页
       规定增删改查的url规则：
       查询 baseUrl + _query
       查看详情 baseUrl + _query_one
       增加  baseUrl + _add
       删除 baseUrl + _delete_one
       编辑 baseUrl + _edit
     </pre>
  </div>
</template>

<script>
  export default {
    name: "index02",
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {}

  }
</script>

<style scoped>

</style>