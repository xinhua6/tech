<!--封装拖拽，右键新增，重命名，删除，排序，搜索跳转-->
<template>
  <div class="c-h100">
    <el-input size="mini" class="search" placeholder="请输入关键字搜索" v-model="filterText" clearable></el-input>
    <div v-loading="loading" class="comp-tree c-flex1" @click="hiddenMenu">
      <el-tree  ref="SlotTree"
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="false"
                highlight-current
                :current-node-key="currentKey"
                :node-key="nodeKey"
                @node-contextmenu="rightClick"
                @node-click="handleNodeClick"
                v-on="$listeners"
                v-bind="$attrs"
      >
        <!--@node-drag-start = "handleDragStart"
                @node-drop="handleDrop"
                :draggable = draggable
                :allow-drag="allowDrag"-->
        <div slot-scope="{node,data}" @mouseleave="mouseLeave" @mouseenter="handMouseenter">
          <!-- 编辑状态 -->
          <template v-if="node.isEdit">
            <el-input v-model="data[label]"
                      autofocus
                      size="mini"
                      :ref="'slotTreeInput'+ data[nodeKey]"
                      @blur.stop="blur(node, data)"
                      @keyup.enter.native="handleInput(node, data)"
            >
            </el-input>
          </template>
          <!-- 非编辑状态 -->
          <template v-else>
            <span>
              <span>
                  {{ node[label] }}
              </span>
            </span>
          </template>
        </div>
      </el-tree>
      <el-tooltip
              placement="top"
              ref="tooltip"
              :content="tooltipContent"></el-tooltip>

      <!-- 鼠标右键产生的选项 -->
      <div v-show="menuVisible" id="menu">
        <el-menu
                class="rightClickMenu"
                @select="handleRightSelect"
        >
          <el-menu-item index="1">
            <i class="el-icon-edit"></i>
            <span slot="title">重命名</span>
          </el-menu-item>
          <el-menu-item index="2" :disabled="isAdd">
            <i class="el-icon-folder-add"></i>
            <span slot="title">新建文件夹</span>
          </el-menu-item>
          <el-menu-item index="3" :disabled="isDelete">
            <i class="el-icon-delete"></i>
            <span slot="title">删除</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-top"></i>
            <span slot="title">升级排序</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-bottom"></i>
            <span slot="title">降级排序</span>
          </el-menu-item>
        </el-menu>
      </div>
      <detail-win v-if="isShow" @close="closeWin" :node = NODE v-bind="$attrs" v-on="$listeners"></detail-win>
    </div>
  </div>
</template>

<script>
  import { baseWarn, delWarn } from 'src/utils/fn'
  import { debounce } from 'src/utils/util.js'

  export default {
    components: {},
    data () {
      return {
        filterText: null,
        isloading: false, // 是否加载
        menuVisible: false,
        isShow: false,
        DATA: null,
        NODE: null,
        dragPid: null,
        dragIndex: null,
        newParentId: null,
        oldLabel: null,
        isDelete: false,
        isAdd: false,
        tooltipContent: null,
        currentKey: null,
        loading: false
      }
    },
    props: {
      nodeKey: {
        type: String,
      },
      parentKey: {
        type: String,
      },
      label: {
        type: String,
        default: 'label'
      },
      defaultProps: {
        type: Object,
        default: () => {
          return { // 默认设置
            children: 'children',
            label: 'label'
          }
        }
      },
      treeData: {
        type: Array,
        required: true
      },
      baseUrl: {
        type: String,
        required: true
      },
    },
    computed: {
      // addNode () {
      //   return this.$sysStore.addNode
      // },
      // draggable () {
      //   if (!this.$store.state.user.isOuterUser) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }

    },
    watch: {
      // '$sysStore.fileTreeData':{
      //   handler(val) {
      //     if (this.NODE) {
      //       let that = this
      //       this.$nextTick(function(){
      //         that.$refs.SlotTree.setCurrentKey(that.currentKey)
      //         let treeNode = document.querySelectorAll('.el-tree-node')
      //         if (treeNode && treeNode.length > 0) {
      //           treeNode.forEach(element => {
      //             if (element.className.indexOf('is-current') !== -1) {
      //               element.scrollIntoView({block: 'end', behavior: 'smooth'})
      //               return
      //             }
      //           })
      //         }
      //       })
      //     }
      //   },
      //   deep: true
      // }
    },
    created () {
      this.handMouseenter = debounce(this.mouseEnter, 50)
    },
    mounted () {
    },
    methods: {
      blur(node,data) {
        if (node.isEdit) {
          this.$set(node, 'isEdit', false)
        }
      },

      // 修改节点
      handleInput (node, data) {
        // 退出编辑状态
        if (node.isEdit) {
          this.$set(node, 'isEdit', false)
        }
        // 名字相同返回，不同请求
        if (this.oldLabel === data[this.label]) {
          return
        } else {
          this.editNode(data)
        }
      },

      editNode(data) {
        this.$axios({
          url: this.baseUrl + '_edit',
          method: 'post',
          data: {
            kid: data.kid,
            label: data[this.label]
          }
        })
        .then(res => {
          this.$message({ type: 'success', message: '重命名成功' })
          this.$store.dispatch(`${this.wpstore}/getFileTreeData`, { projId: this.$sysStore.projId })
        })
        .catch(function (error) {
          this.$message({ type: 'error', message: '重命名失败' })
          console.log(error)
        })
      },

      // 重命名
      handleEdit (node, data) {
        // 设置编辑状态
        if (!node.isEdit) {
          this.$set(node, 'isEdit', true)
        }
        // 输入框聚焦
        this.$nextTick(() => {
          if (this.$refs['slotTreeInput' + data[this.nodeKey]]) {
            this.$refs['slotTreeInput' + data[this.nodeKey]].$refs.input.focus()
            this.$refs['slotTreeInput' + data[this.nodeKey]].$refs.input.value = this.NODE[this.label]
          }
        })
      },

      // 新增节点
      handleAdd (node, data) {

      },

      // 删除节点
      handleDelete (node, data) {
        delWarn(this.deleteProj, null, {node,data})
      },

      deleteProj (node, data) {
        this.$axios({
          url: this.baseUrl + '_delete_one',
          method: 'post',
          data: {
            kid: node.data.kid
          }
        })
          .then(res => {
            if (res.success) {
              let _list = node.parent.data.children || node.parent.data// 节点同级数据
              let _index = _list.map((c) => c[this.nodeKey]).indexOf(data[this.nodeKey])
              _list.splice(_index, 1)
              this.$message.success('删除成功')
              // 使右侧列表消失
              this.$parent.$parent.disabled = true
              // 直接改变vuex中treeData的数值
              let fileTreeData = this.filter(this.data, node.data.kid)
              this.$store.dispatch(`${this.wpstore}/setFileTreeData`, fileTreeData)
            } else {
              this.$message.error('删除失败，请重试')
            }
          })
      },

      /**
       * 删除或者更改treeData中指定kid的子节点
       *
       * @returns arr
       */
      filter (arr, kid) {
        for (var i = 0; i < arr.length; i++) {
          var el = arr[i]
          if (el.kid === kid) {
            arr.splice(i, 1)
          } else {
            if (el.children && el.children.length) {
              this.filter(el.children, kid)
            }
          }
        }
        return arr
      },

      // 点击节点
      handleNodeClick (node) {
        this.menuVisible = false
        // this.$store.dispatch(`${this.wpstore}/selectNode`, node)
        this.$emit('nodeClick', node)
      },

      // 拖拽开始时记录该节点的pid及其在原来数组中的原始数据
      handleDragStart (node) {
        console.log(node, 'start')
        this.dragPid = node.data[this.parentKey]
        let p = this.$refs.SlotTree.getNode(this.dragPid)
        let _list = p.data.children // 节点同级数据
        let _index = _list.map((c) => c[this.nodeKey]).indexOf(node.data[this.nodeKey])
        this.dragIndex = _index
      },

      // 拖拽成功时触发请求
      handleDrop (draggingNode, dropNode, dropType, e) {
        console.log(draggingNode, dropNode, dropType, 'end')
        if (dropNode.data.fileCount !== 0 && dropType === 'inner') {
          baseWarn('该文件夹内含有上传文件，拖拽失败', null, null, null)
          let _list = dropNode.data.children // 节点同级数据
          let _index = _list.map((c) => c[this.nodeKey]).indexOf(draggingNode.data[this.nodeKey])
          _list.splice(_index, 1)
          // 将节点返回到原来的位置上
          let p = this.$refs.SlotTree.getNode(this.dragPid)
          // console.log(p,'p')
          p.data.children.splice(this.dragIndex, 0, draggingNode.data)
        } else if (dropNode.data[this.parentKey] === 'root') {
          baseWarn('拖拽失败', null, null, null)
          this.$refs.SlotTree.remove(draggingNode.data[this.nodeKey])
          let p = this.$refs.SlotTree.getNode(this.dragPid)
          p.data.children.splice(this.dragIndex, 0, draggingNode.data)
        } else {
          // 算出子节点对于父节点的相对位置
          let _list = dropNode.parent.data.children // 拖拽节点同级数据
          let _index = _list.map((c) => c[this.nodeKey]).indexOf(draggingNode.data[this.nodeKey])
          if (_index === -1) {
            _list = dropNode.childNodes
            _index = _list.map((c) => c.data[this.nodeKey]).indexOf(draggingNode.data[this.nodeKey])
          }
          // 得出目标节点的recordId
          if (dropType === 'inner') {
            // 相同的父节点
            this.newParentId = dropNode.data[this.nodeKey]
          } else {
            this.newParentId = dropNode.parent.data[this.nodeKey]
          }
          // 发送请求
          this.$axios({
            url: '/HMS-DATA/imisFileDictProj_move',
            method: 'post',
            data: {
              kid: draggingNode.data.kid,
              oldParentId: this.dragPid,
              newParentId: this.newParentId,
              newOrder: _index + 1
            }
          })
            .then(res => {
              this.$message({ type: 'success', message: '拖拽成功' })
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },

      // 鼠标右击
      rightClick (event, object, value, element) {
        console.log(event, object, value, element)
        this.currentKey = this.$refs.SlotTree.getCurrentKey() || value.key
        this.isShowRight(object)
        this.oldLabel = object[this.label]
        this.DATA = object
        this.NODE = value
        this.menuVisible = true
        this.hiddenMenu()
        let menu = document.querySelector('.rightClickMenu')
        /* 菜单定位基于鼠标点击位置 */
        let height = document.documentElement.clientHeight || document.body.clientHeight
        if (event.clientY + 168 > height) {
          menu.style.left = event.clientX - 5 + 'px'
          menu.style.top = event.clientY - 10 - 168 + 'px'
        } else {
          menu.style.left = event.clientX + 10 + 'px'
          menu.style.top = event.clientY + 5 + 'px'
        }
        menu.style.position = 'fixed'
      },

      /*
      * 文件夹内含有文件夹或者文件不能删除
      * 文件夹内含有文件不能新增文件夹*/
      isShowRight(object) {
        if (object[this.parentKey] === 'root' || object.fileCount !== 0 || object.children.length ) {
          this.isDelete = true
        } else {
          this.isDelete = false
        }
        if (object.fileCount !== 0) {
          this.isAdd = true
        } else {
          this.isAdd = false
        }
      },

      handleRightSelect (key) {
        this.menuVisible = false
        if (key == 1) {
          this.handleEdit(this.NODE, this.DATA)
        } else if (key == 2) {
          this.handleAdd(this.NODE, this.DATA)
        } else if (key == 3) {
          this.handleDelete(this.NODE, this.DATA)
        }
      },

      hiddenMenu () {
        document.addEventListener('click', this.hide, true)
        document.removeEventListener('click', this.hide)
      },

      allowDrag (draggingNode) {
        return draggingNode.data[this.parentKey] !== 'root'
      },

      hide () {
        let i = 0
        this.menuVisible = false
        console.log(i++)
      },

      closeWin (val) {
        this.isShow = val
      },

      mouseEnter (event) {
        const cell = event.target
        if ((cell.scrollWidth > 300) && this.$refs.tooltip) {
          const tooltip = this.$refs.tooltip
          this.tooltipContent = cell.innerText
          tooltip.referenceElm = cell
          tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
          tooltip.doDestroy()
          tooltip.setExpectedState(true)
          tooltip.handleShowPopper()
        }
      },

      mouseLeave () {
        const tooltip = this.$refs.tooltip
        if (tooltip) {
          tooltip.setExpectedState(false)
          tooltip.handleClosePopper()
        }
      },

      getFileTreeData ({ commit }, params) {
        commit('SET_FILE_TREE_LOADING', true)
        axios({
          url: '/HMS-DATA/imisFileProjRelation_queryTree',
          params: params
        })
          .then(res => {
            commit('SET_FILE_TREE_DATA', res.data)
          })
          .finally(() => {
            commit('SET_FILE_TREE_LOADING', false)
          })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .el-menu {
    border: solid 1px #e6e6e6
  }

  .comp-tree {
    margin-top: 1em;
    overflow-y: scroll;
    overflow-x: scroll;
  }

  .el-tree {
    min-width: 100%;
    display:inline-block !important;
  }

  .rightClickMenu {
    z-index: 999
  }

</style>
