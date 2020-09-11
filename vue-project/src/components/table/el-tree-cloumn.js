import ElCloumn from 'element-ui/lib/table-column'
import { getPropByPath } from 'element-ui/lib/utils/util'
import WpSvgIcon from 'src/global/icon/svg-icon'
const cellForced = {
  selection: {
    renderHeader: function (h, { store }) {
      return <el-checkbox
        disabled={store.states.data && store.states.data.length === 0}
        indeterminate={store.states.selection.length > 0 && !this.isAllSelected}
        nativeOn-click={this.toggleAllSelection}
        value={this.isAllSelected}/>
    },
    renderCell: function (h, { row, column, store, $index }) {
      return <el-checkbox
        nativeOn-click={(event) => event.stopPropagation()}
        value={store.isSelected(row)}
        disabled={column.selectable ? !column.selectable.call(null, row, $index) : false}
        on-input={() => { store.commit('rowSelectedChanged', row) }}/>
    },
    sortable: false,
    resizable: false
  },
  index: {
    renderHeader: function (h, { column }) {
      return column.label || '#'
    },
    renderCell: function (h, { $index, column }) {
      let i = $index + 1
      const index = column.index

      if (typeof index === 'number') {
        i = $index + index
      } else if (typeof index === 'function') {
        i = index($index)
      }

      return <div>{i}</div>
    },
    sortable: false
  },
  expand: {
    renderHeader: function (h, { column }) {
      return column.label || ''
    },
    renderCell: function (h, { row, store }) {
      const classes = ['el-table__expand-icon']
      if (store.states.expandRows.indexOf(row) > -1) {
        classes.push('el-table__expand-icon--expanded')
      }
      const callback = function (e) {
        e.stopPropagation()
        store.toggleRowExpansion(row)
      }
      return (<div class={classes}
        on-click={callback}>
        <i class='el-icon el-icon-arrow-right'></i>
      </div>)
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column'
  }
}

function defaultRenderCell (h, { row, column, $index }) {
  const property = column.property
  const value = property && getPropByPath(row, property).v
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index)
  }
  return value
}

function treeCellPrefix (h, { row, treeNode, store }) {
  if (!treeNode) return [(<span class="el-table__indent" style={{ 'padding-left': 23 + 'px' }}></span>)]
  const ele = []
  if (treeNode.indent) {
    ele.push(<span class="el-table__indent" style={{ 'padding-left': treeNode.indent + 'px' }}></span>)
  }
  const callback = function (e) {
    e.stopPropagation()
    store.loadOrToggle(row)
  }
  if (typeof treeNode.expanded === 'boolean' && !treeNode.noLazyChildren) {
    const expandClasses = ['el-table__expand-icon', 's-c']
    let iconClasses = treeNode.expanded ? 'tree-close' : 'tree-open'
    if (treeNode.loading) {
      iconClasses = ['el-icon-loading']
    }
    ele.push(<div class={ expandClasses }
      style={{ fontSize: '1.4rem' }}
      on-click={ callback }>
      <wp-svg-icon icon={iconClasses}></wp-svg-icon>
    </div>)
  } else {
    ele.push(<span class="el-table__placeholder"></span>)
  }
  return ele
}

// element-ui 2.12
export default {
  extends: ElCloumn,
  components: { WpSvgIcon },
  created () {
    ElCloumn.created.call(this)
  },
  methods: {
    setColumnRenders (column) {
      const specialTypes = Object.keys(cellForced)
      // renderHeader 属性不推荐使用。
      if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.')
      } else if (specialTypes.indexOf(column.type) === -1) {
        column.renderHeader = (h, scope) => {
          const renderHeader = this.$scopedSlots.header
          return renderHeader ? renderHeader(scope) : column.label
        }
      }

      let originRenderCell = column.renderCell

      originRenderCell = originRenderCell || defaultRenderCell
      // 对 renderCell 进行包装
      column.renderCell = (h, data) => {
        let children = null
        if (this.$scopedSlots.default) {
          children = this.$scopedSlots.default(data)
        } else {
          children = originRenderCell(h, data)
        }
        const prefix = treeCellPrefix(h, data)
        const props = {
          class: 'cell',
          style: {}
        }
        if (column.showOverflowTooltip) {
          props.class += ' el-tooltip'
          props.style = { width: (data.column.realWidth || data.column.width) - 1 + 'px' }
        }
        return (<div {...props}>
          {prefix}
          {children}
        </div>)
      }
      return column
    }
  }
}
