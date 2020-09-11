/**
 *  column = {
 *      label: string
 *      prop:string
 *      rowspan:1
 *      colspan:1
 *      width: 100
 *      fixed: 'left' | 'right'
 *      type: 'index' | 'selection',
 *      slot:'row-slot'
 *      slotHead: 'head-slot'
 *  }
 */
import th from 'element-ui/src/locale/lang/th'

export default {
  name: 'sclc-header',
  inject: {
    store: 'store'
  },
  props: {},
  data () {
    return {}
  },
  computed: {
    headerColumn () {
      return convertToRows(this.store.columns)
    }
  },
  mounted () {
    this.store.headEl = this.$refs.table
  },
  methods: {
    renderCell (col) {
      const slot = this.store.getSlots(col, true)
      const { fixedStyle, fixedClass } = this.store.getFixedStyle(col)
      const isResize = col.colSpan === 1
      const cell = (<div class='cell'>{slot ? slot({ col }) : col.label}</div>)
      return isResize
        ? (<th rowSpan={col.rowSpan} colSpan={col.colSpan} style={fixedStyle} class={fixedClass}>
          {cell}
        </th>)
        : (<th rowSpan={col.rowSpan} colSpan={col.colSpan} style={fixedStyle} class={fixedClass}>
          {cell}
        </th>)
    }
  },
  render () {
    const { renderColumns, tableStyle } = this.store
    return (
      <div>
        <div class='sclc-table-header' ref='table'>
          <table style={tableStyle} >
            <colgroup>
              {
                renderColumns.map(col => {
                  return <col width={col.width} style={{ width: col.width + 'px' }}/>
                })
              }
            </colgroup>
            <thead>
              {
                this.headerColumn.map(column => {
                  return (<tr>
                    {
                      column.map(col => {
                        return this.renderCell(col)
                      })
                    }
                  </tr>)
                })
              }
            </thead>
          </table>
        </div>
        {/*reszie*/}
        <div></div>
      </div>
    )
  }
}
const getAllColumns = (children) => {
  const result = []
  children.forEach((column) => {
    if (column.children) {
      result.push(column)
      result.push.apply(result, getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

const convertToRows = (originColumns) => {
  let maxLevel = 1
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }

  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)

  allColumns.forEach((column) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}
