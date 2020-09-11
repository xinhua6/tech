<template>
  <div class="c-h100">
    <tree :treeData="treeData" :baseUrl="baseUrl"
          :defaultProps="defaultProps"
          :nodeKey="nodeKey"
          :label="label"></tree>
  </div>
</template>

<script>
  import tree from 'src/components/slot_tree/index.vue'
  export default {
    name: "index",
    components: {
      tree
    },
    data() {
      return {
        baseUrl: '/reqmenu/menu01',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'fileName'
        },
        label: 'fileName',
        nodeKey: 'kid'
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
      getData() {
        this.$axios({
          method: 'get',
          url: this.baseUrl + '_query',
          params: {
            ...this.ajaxData
          },
          loadingVm:this
        }).then(res => {
          this.treeData = res.data
        })
      },
    }
  }
</script>

<style scoped lang="scss">

</style>