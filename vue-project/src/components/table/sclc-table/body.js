function getCell (event) {
  let cell = event.target
  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell
    }
    cell = cell.parentNode
  }
  return null
}

export default {
  inject: {
    store: 'store'
  },
  methods: {
    renderCell ({ col, row }) {
      const slot = this.store.getSlots(col)
      const { fixedStyle, fixedClass } = this.store.getFixedStyle(col)
      const rowStyle = (col.rowspan && !row.rowspan) ? 'display: none' : null // 去掉合并列后多余的
      let style = null // 处理固定列和合并列后多余的td的样式问题
      if (col.fixed === 'left' || col.fixed === 'right') {
        style = fixedStyle
      } else {
        style = rowStyle
      }
      return (
        <td style={ style } class={fixedClass} data-key={col.prop} rowSpan={col.rowspan ? row.rowspan : 1 }>
          <div class='cell'>
            {
              slot ? slot({ col, row }) : row[col.prop]
            }
          </div>
        </td>)
    },
    gridRowClick (row) {
      this.store.$emit('grid-row-click', row)
    },
    rowClick (row, event) {
      const cell = getCell(event)
      if (cell) {
        const { renderColumns } = this.store
        const coloumnKey = cell.dataset.key
        const currentCol = renderColumns.find(col => col.prop === coloumnKey)
        this.store.$emit('row-click', row, currentCol, event)
        this.store.currentRow = row
      }
    },
    expandChange (row, event) {
      this.store.updateExpand(row)
    },
    renderTreeGridRow (row, index, expand) {
      const solt = this.store.$scopedSlots['tree-grid']
      const { renderColumns } = this.store
      const { fixedStyle } = this.store.getFixedStyle(renderColumns[0])
      const iconClass = ['sclc-tree-icon', expand ? 'el-icon-minus' : 'el-icon-plus']
      return (
        <tr class='sclc-tree-grid-row' onClick={(e) => this.gridRowClick(row, e)}>
          <td colSpan={renderColumns.length}>
            <div class='sclc-tree-grid-cell' style={fixedStyle}>
              <i class={iconClass} onClick={(e) => this.expandChange(row, e)}></i>
              {solt ? solt({ row: row }) : index}
            </div>
          </td>
        </tr>
      )
    }
  },
  render () {
    const { renderRows, renderColumns, scrollX, rowClassName, highlightCurrentRow, currentRow, treeConfig, treeData } = this.store

    const renderRow = (row, rowIndex) => {
      const customClass = typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName
      const rowClass = highlightCurrentRow && row === currentRow ? [customClass, 'current-row'] : customClass
      return (
        <tr onClick={(e) => this.rowClick(row, e)} class={rowClass}>
          {
            renderColumns.map(col => {
              return this.renderCell({ col, row, scrollX })
            })
          }
        </tr>
      )
    }

    let tableRows = []
    if (treeConfig.isTreeGrid) {
      renderRows.map((row, rowIndex) => {
        const children = row[treeConfig.childKey]
        const expand = treeData[row[treeConfig.key]].expand
        tableRows.push(this.renderTreeGridRow(row, rowIndex, expand))
        if (expand && children && children.length) {
          const child = children.map(renderRow)
          child.push.apply(tableRows, child)
        }
      })
    } else {
      tableRows = renderRows.map(renderRow)
    }

    return (<tbody>{tableRows}</tbody>)
  }
}
