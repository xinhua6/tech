<!--使用el-tree进行封装-->
<template>
  <div class="c-h100">
    <div class="c-flex tree_header c-jc_sa" style="font-size: 14px;">
      <div v-for="item in formItems" :class="item.class" :style="item.style">{{item.label}}</div>
    </div>
    <el-tree
            :data="tableData"
            ref="tree"
            show-checkbox
            :node-key="rowKey"
            @check="checkChange"
            default-expand-all
            :expand-on-click-node="false">
      <template v-slot:default="{ node, data }">
        <div class="c-jc_sa c-flex_1" >
          <span v-for="item in nodeData">{{data[item]}}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
  export default {
    name: "tree-table02",
    data() {
      return {}
    },
    props: {
      formItems: {
        type: Array,
        default() {
          return [
            {
              label: '名称',
              style: {
                width: ''
              },
              class: 'c-flex_1',
              value: 'projName'
            }
          ]
        }
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      rowKey: {
        type: String,
        default: 'typeId'
      },
    },
    computed: {
      nodeData() {
        return this.formItems.map(item => {
          return item.value
        })
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      checkChange() {
        const select = this.$refs.tree.getCheckedNodes()
        this.$emit('node-change',select)
      }
    }

  }
</script>

<style scoped>

</style>