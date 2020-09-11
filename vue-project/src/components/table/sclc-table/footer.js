export default {
  inject: {
    store: 'store'
  },
  methods: {
    renderCell (col, value) {
      // const slot = this.store.getSlots(col)
      const { fixedStyle, fixedClass } = this.store.getFixedStyle(col)
      return (
        <td style={fixedStyle} class={fixedClass}>
          <div class='cell'>
            {
              value
              // slot ? slot({ col, value }) : value
            }
          </div>
        </td>
      )
    },
    // TODO resize
    updateTranslate () {
      // setTimeout(() => {
      this.$nextTick(this.$forceUpdate)
      // })
    }
  },
  mounted () {
    this.updateTranslate()
    this.store.$on('tree-expand-change', this.updateTranslate)
  },
  render () {
    const { footRows, renderColumns, scrollY, $refs, tableStyle } = this.store
    const bodyEl = $refs.bodyEl
    const translateY = bodyEl ? scrollY + bodyEl.clientHeight - bodyEl.scrollHeight : 0
    const style = { transform: `translateY(${translateY}px)` }
    return (
      <div class='sclc-table-footer' style={style}>
        <table style={tableStyle}>
          <colgroup>
            {
              renderColumns.map(col => {
                return <col width={col.width} style={{ width: col.width + 'px' }}/>
              })
            }
          </colgroup>
          <tfoot>
            {
              footRows.map(rowArr => {
                return (
                  <tr>
                    {
                      renderColumns.map((col, index) => {
                        return this.renderCell(col, rowArr[index])
                      })
                    }
                  </tr>
                )
              })
            }
          </tfoot>
        </table>
      </div>
    )
  }
}
