<template>
  <el-table
          ref="tree-table"
          class="tree-table c-w100"
          border
          fit
          size="mini"
          highlight-current-row
          :data="treeData"
          :tree-props="treeProps"
          :row-key="rowKey"
          v-bind="$attrs"
  >
    <el-table-column label="#" :render-header="renderHeader">
      <template slot-scope="scope">
        <el-checkbox
                v-model="scope.row.checked"
                :indeterminate="scope.row.indeterminate"
                @change="handleCheckChange(scope.row, $event)">
        </el-checkbox>
      </template>
    </el-table-column>
    <template v-for="(item,index) in columns">
      <el-table-column
              :key="index"
              v-bind="item"
              :label="item.label"
              :prop="item.prop"
              :fixed="item.fixed"
              :type="item.type"
              :width="item.width"
              :class-name="item.class"
              :min-width="item.minWidth"
              :align="item.align"
              :show-overflow-tooltip="item.showTooltip"
      />
    </template>
  </el-table>
</template>

<script>
  export default {
    name: "treeTable",
    data() {
      return {
        checkboxDatas: []
      }
    },
    props: {
      rowKey: {
        type: String,
        default: 'kid'
      },
      parentId: {
        type: String,
        default: 'parent'
      },
      treeData: {
        type: Array,
        default: () => []
      },
      treeProps: {
        type: Object,
        default: () => {
          return {
            children: 'children',
            hasChildren: 'hasChildren'
          }
        }
      },
      columns: {
        type: Array,
        default: () => []
      },
    },
    computed: {
      dataTree() {
        return this.treeToList(this.treeData)
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        var that = this
        // 最顶上的复选框chanage事件
        const all = document.getElementById('chooseall')
        all.onchange = function(e) {
          if (that.treeData.length > 0) {
            that.treeData.forEach(x => {
              // x.checked = all.checked
              that.$set(x, 'checked', all.checked)
              that.handleCheckAllChange(x,all.checked)
            })
            that.$emit('select-change',that.checkboxDatas)
          }
        }
      })
    },
    methods: {
      // 头部的单选框
      renderHeader(h, data) {
        return h(
          'label',
          {
            attrs: {
              id: 'labels',
              role: 'checkbox',
              class: 'el-checkbox el-text'
            }
          },
          [
            h(
              'span',
              {
                attrs: {
                  id: 'spand',
                  'aria-checked': 'mixed',
                  class: 'el-checkbox__input'
                }
              },
              [
                h('span', {
                  attrs: {
                    class: 'el-checkbox__inner'
                  }
                }),
                h('input', {
                  attrs: {
                    id: 'chooseall',
                    'aria-hidden': 'true',
                    type: 'checkbox',
                    style: 'display: none'
                  }
                })
              ]
            )
          ]
        )
      },

      handleCheckChange(val, checked) {
        this.handleCheckAllChange(val, checked)
        this.$emit('select-change',this.checkboxDatas)
      },

      handleCheckAllChange(val, checked) {
        // 有下级去处理下级
        if ('children' in val && val.children.length > 0) {
          this.findChildren(val.children, checked)
        }
        // 处理上级
        if (val[this.parentId] !== 0) {
          this.findParent(this.treeData, val[this.parentId])
        }
        val.indeterminate = false
        checked && !this.isConclude(this.checkboxDatas,val,this.rowKey) ? this.checkboxDatas.push(val) : this.remove(this.checkboxDatas,val,this.rowKey)
        this.selectClick(val)
      },

      findChildren(list, checked) {
        list.forEach(children => {
          // children.checked = checked
          this.$set(children,'checked',checked)
          children.indeterminate = false
          checked && !this.isConclude(this.checkboxDatas,children,this.rowKey) ? this.checkboxDatas.push(children) : this.remove(this.checkboxDatas,children,this.rowKey)
          if ('children' in children && children.children.length > 0) {
            this.findChildren(children.children, checked)
          }
        })
      },

      findParent(list, parentId) {
        list.forEach(result => {
          let parentCheckedLength = 0
          let parentIndeterminateLength = 0
          if (result[this.rowKey] === parentId) {
            result.children.forEach(children => {
              if (children.indeterminate) {
                parentIndeterminateLength++
              } else if (children.checked) {
                parentCheckedLength++
              }
            })
            // result.checked = parentCheckedLength === result.children.length
            let end = parentCheckedLength === result.children.length
            this.$set(result, 'checked', end)
            result.indeterminate = (parentIndeterminateLength > 0 || parentCheckedLength > 0) && parentCheckedLength < result.children.length
            result.checked && !this.isConclude(this.checkboxDatas, result, this.rowKey)? this.checkboxDatas.push(result) : this.remove(this.checkboxDatas,result, this.rowKey)
            if (result[this.parentId] !== 0) {
              this.findParent(this.treeData, result[this.parentId])
            }
          } else if ('children' in result && result.children.length > 0) {
            this.findParent(result.children, parentId)
          }
        })
      },

      selectClick(row) {
        this.$nextTick(() => {
          if (this.checkboxDatas.length == this.dataTree.length) {
            document.getElementById('spand').className = 'el-checkbox__input is-checked' // 设置全选框全选
            document.getElementById('spand').checked = true // 设置全选框全选
          } else if (this.checkboxDatas.length != 0) {
            document.getElementById('spand').className += ' is-indeterminate' // 设置全选框的半选
          } else {
            document.getElementById('spand').className = 'el-checkbox__input' // 设置全选框未选中状态
          }
        })
      },

      // 将树结构扁平化 用于判断
      treeToList(tree) {
        var queen = []
        var out = []
        queen = queen.concat(tree)
        while (queen.length) {
          var first = queen.shift()
          if (first.children != undefined && first.children) {
            queen = queen.concat(first.children)
          }
          out.push(first)
        }
        return out
      },

      isConclude(parent,child,id) {
        return parent.some(item => item[`${id}`] === child[`${id}`])
      },

      remove(parent,child,id) {
        let index = parent.findIndex(item => item[`${id}`] === child[`${id}`])
        if (index > -1) {
          parent.splice(index, 1)
        }
      }
    }

  }
</script>

<style scoped lang="scss">
  .tree-table {
    overflow-y: scroll !important;
    /deep/ tr {
      height: 6rem;
    }
  }

</style>
