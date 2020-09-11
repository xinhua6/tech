<template>
  <div class="c-h100">
    <div>实现在线excel的读取，关联行列，与导出</div>
    <pre>
      参数配置：
        上传地址：uploadUrl
        导入地址：importUrl
        基本地址：baseUrl
        保存关联参数地址：baseUrl + '_saveAll',
        选择关联参数后导入相关数据地址：baseUrl + '_query_one'
        列参数选择：radioData,
        行参数选择：rowData
      }
    </pre>
    <div id="handsontable"></div>
    <!--<excel></excel>-->
  </div>
</template>

<script>
  import Handsontable from "handsontable";
  import 'handsontable/dist/handsontable.full.css';
  export default {
    name: "index",
    data() {
      return {}
    },
    components: {},
    computed: {},
    watch: {},
    created() {
      this.initData()
    },
    mounted() {
    },
    methods: {
      initData() {
        const container = document.getElementById('handsontable');
        const hot = new Handsontable(container, {
          rowHeaders: true,
          colHeaders: true
        });
      }
    }

  }
</script>

<style scoped lang="scss">

</style>