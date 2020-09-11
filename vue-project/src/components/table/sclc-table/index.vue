<template>
    <div class="sclc-table" :class="{
      'sclc-fiexd-table': isFixed
    }">
        <sclc-header></sclc-header>
        <div class="sclc-body" @scroll="tablelScrollChange" ref="bodyEl" :style="bodyStyle">
            <div v-if="data.length === 0" style="text-align: center;padding: 10px">暂无数据</div>
            <table v-else class="sclc-data-table"
                   :style="tableStyle"
                   :class="{
                       'sclc-data-stripe':stripe,
                       'sclc-data-tree-grid':treeConfig.isTreeGrid
                   }">
                <!-- column width-->
                <colgroup>
                    <template v-for="col in renderColumns">
                        <col :width="col.width" :key="col.prop" :style="{width:col.width+'px'}"/>
                    </template>
                </colgroup>
                <sclc-body></sclc-body>
            </table>
            <sclc-foot v-if="footRows.length"></sclc-foot>
        </div>
    </div>
</template>
<script>
  import SclcHeader from './header'
  import SclcBody from './body.js'
  import SclcFoot from './footer.js'
  import selection from './selection'
  import tree from './tree'

  function getColumnList (columns) {
    const result = []
    columns.forEach(column => {
      result.push(...(column.children && column.children.length ? getColumnList(column.children) : [column]))
    })
    return result
  }

  export default {
    name: 'sclc-table',
    components: {
      SclcHeader, SclcBody, SclcFoot
    },
    mixins: [selection, tree],
    provide () {
      return { store: this }
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      },
      rowsHeight: {
        type: [Number, String],
        default: 'auto'
      },
      footerMethod: {
        type: Function
      },
      rowClassName: {
        type: Function
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      stripe: {
        type: Boolean,
        default: false
      },
      virturalY: {
        default: false
      }
    },
    data () {
      return {
        // renderRows: [],
        renderColumns: [],
        // tableWidth: 100,
        fixLeftLastName: null,
        footRows: [],
        scrollX: 0,
        scrollY: 0,
        bodyHeight: 100
      }
    },
    computed: {
      renderRows () {
        return this.data
      },
      tableStyle () {
        return {
          width: this.tableWidth + 'px'
        }
      },
      tableWidth () {
        const total = this.renderColumns.reduce((pre, next) => {
          return {
            width: pre.width + next.width
          }
        })
        return total.width
      },
      bodyStyle () {
        return {
          height: this.bodyHeight + 'px'
        }
      },
      isFixed () {
        return this.scrollX > 0 && this.fixLeftLastName
      }
    },
    watch: {
      data: {
        handler () {
          this.currentRow = null
          this.setFooterRows()
        }
      },
      columns: {
        immediate: true,
        handler () {
          const column = getColumnList(this.columns).map(col => ({ ...col }))
          let lastCol = null
          column.some(col => {
            if (col.fixed) {
              lastCol = col
              return false
            }
            return true
          })
          if (lastCol) {
            this.fixLeftLastName = lastCol.prop
          } else {
            this.fixLeftLastName = null
          }
          this.renderColumns = column
          this.setFooterRows()
        }
      }
    },
    mounted () {
      this.$nextTick(this.updateElHeight)
      window.addEventListener('resize', this.updateElHeight)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateElHeight)
    },
    methods: {
      getSlots (column, isHeaderSlot) {
        return isHeaderSlot ? this.$scopedSlots[column.slotHead] : this.$scopedSlots[column.slot]
      },
      getFixedStyle (col) {
        const isFixed = col.fixed === 'left'
        if (isFixed && this.scrollX) {
          const fixedStyle = { transform: `translateX(${this.scrollX + 'px'})` }
          const fixedClass = ['sclc-fix-left', this.fixLeftLastName === col.prop ? 'sclc-fixed-last' : null]
          return { fixedStyle, fixedClass }
        }
        return {}
      },
      tablelScrollChange (e) {
        const bodyEl = this.$refs.bodyEl
        this.headEl.scrollLeft = bodyEl.scrollLeft
        this.scrollX = bodyEl.scrollLeft
        this.scrollY = bodyEl.scrollTop
      },
      setFooterRows () {
        if (typeof this.footerMethod === 'function' && this.data.length) {
          this.footRows = this.footerMethod({ columns: this.renderColumns, data: this.data })
          return
        }
        this.footRows = []
      },
      updateElHeight () {
        this.bodyHeight = this.$el.clientHeight - this.headEl.clientHeight
      }
    }
  }
</script>
<style lang="scss" name="table">
    $border-color: #ebebeb;
    $stripe-bg: #fafafa;
    $current-bg: #ecf8eb;
    $header-bg: #f5f8fa;
    .sclc-table {
        position: relative;
        height: 100%;

        table {
            table-layout: fixed;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid $border-color;
            background: #fff;

            .cell {
                padding: 10px;
                word-break: break-all;
            }
        }
    }

    .sclc-fiexd-table {
        border-left: 1px solid $border-color;
    }

    .sclc-body {
        width: 100%;
        overflow: scroll;
    }

    .sclc-fix-left {
        position: relative;
    }

    .sclc-fix-left::after {
        bottom: -1px;
        position: absolute;
        content: " ";
        background: $border-color;
        height: 100%;
        width: 1px;
        top: 0;
        right: -1px;
    }

    .sclc-fixed-last:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: -1px;
        width: 10px;
        content: '';
        background: transparent;
        pointer-events: none;
        box-shadow: inset 5px 0 4px -4px rgba(0, 0, 0, 0.15);
    }

    .sclc-data-stripe {
        tr:nth-child(2n+0) > td {
            background: $stripe-bg;
        }
    }

    .sclc-data-tree-grid {
        .sclc-tree-grid-row > td {
            background: $header-bg;
        }
        .sclc-tree-grid-cell {
            display: inline-flex;
            align-items: center;
            padding: 5px 2px;
        }
    }
    .sclc-tree-icon{
        cursor: pointer;
        border: 1px solid $border-color;
        padding: 2px;
        margin: 3px;
    }

    .sclc-data-table {
        tr.current-row > td {
            background: $current-bg;
        }
    }

    .sclc-table-header {
        overflow: hidden;
        overflow-y: scroll;
        /*background: #fafafa;*/
        th {
            background: $header-bg;
        }
    }

    .sclc-table-footer {
        tr > td {
            background: $header-bg;
        }
    }
</style>
