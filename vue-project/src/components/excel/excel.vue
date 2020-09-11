<template>
  <div ref="sheet" class="c-h100 c-flex1"></div>
</template>

<script>
  import SpreatSheet from 'src/common/components/spreadsheet/index'
  import Excel from 'exceljs/lib/exceljs.browser'
  import excelAction from './excel-action'
  import FileSaver from 'file-saver'
  import { debounce } from 'src/utils/util'
  export default {
    name: 'excel',
    mixins: [excelAction],
    components: {},
    data () {
      return {
      }
    },
    computed: {
      initData () {
        return {
          styles: [],
          merges: [],
          rows: {
            len: 200
          },
          cols: {
            len: 50
          }
        }
      },
    },
    props: {
      // 已经设置的关联列
      selectCol: {
        type: Array,
        default: []
      },
      refresh: {
        type: Boolean
      }
    },
    watch: {
      refresh: {
        handler(val) {
          window.sheet.loadData(this.initData)
        }
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      afterSelection (row, col, rowEnd, colEnd) {
        this.selectRange = [row, col, rowEnd, colEnd]
        // console.log(this.selectRange, '当前选中数据')
        this.$emit('selectRange', this.selectRange)
      },

      // 获取右键操作
      getOperate (operate) {
        this.$emit('getOperate', operate)
      },

      // 渲染excel
      init () {
        return new Promise(resolve => {
          const dom = this.$refs.sheet
          const sheet = new SpreatSheet(dom, {
            showToolbar: true,
            showGrid: true,
            view: {
              height: () => {
                return dom.clientHeight
              },
              width: () => dom.clientWidth
            },
            // renderRowHeader: this.renderRowHeader,
            renderColHeader: this.renderColHeader,
            events:{
              afterSelection: debounce(this.afterSelection, 100),
              getOperate: this.getOperate,
              afterCellOver: this.afterCellOver,
              afterCellOut: this.afterCellOut
            }
          })
          sheet.loadData(this.initData)
          sheet.change((cdata) => {
              this.$set(this.initData,'merges',cdata['merges'])
              this.$set(this.initData,'rows',cdata['rows'])
              this.$set(this.initData,'cols',cdata['cols'])
              this.$set(this.initData,'styles',cdata['styles'])
              this.$emit('getExcelStyle',cdata)
          })
          // 初始加载时获取行数和列数
          // console.log(sheet.getData())
          this.$emit('getExcelStyle',sheet.getData())
          window.sheet = sheet
          window.Excel = Excel
          resolve(Excel)
        })
      },


      // 修改列头
      renderColHeader (index, originalText) {
        // return index < 5 ? `[${originalText}]` : originalText
        if (this.selectCol.some(item => item === index)) {
          // console.log('changeCol')
          return `[${originalText}]`
        } else {
          return originalText
        }
      },


      // 监听鼠标进入
      afterCellOver (cellMsg) {
        // console.log(cellMsg, 'afterCellOver')
        // cellMsg中rowIndex,colIndex=-1  存在关联项目则悬浮窗口
        this.$emit('floatWindow', cellMsg, 'cellIn')
      },


      // 监听鼠标离开
      afterCellOut (cellMsg) {
        this.$emit('floatWindow', cellMsg,'cellOut')
        // console.log(cellMsg, 'afterCellOut')
      },


      // 保存编辑的excel
      exportExcel () {
        return new Promise(resole => {
          const workbook = new Excel.Workbook()
          const worksheet = workbook.addWorksheet('Sheet')
          this.setRowData(worksheet)
          this.setCol(worksheet)
          this.setCell(worksheet)
          this.setCellMerge(worksheet)
          console.log(worksheet)
          workbook.xlsx.writeBuffer()
            .then(buffer => {
              resole(new Blob([buffer],{type: 'application/vnd.ms-excel'}))
              return new Blob([buffer])
            })
            .catch(err => console.log('Error writing excel export', err))
        })
      },

      // 导入excel
      importExcel(file) {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onabort = () => {
            console.warn('读取excel意外终止')
          }
          reader.onload = async (e) => {
            const workbook = new Excel.Workbook()
            await workbook.xlsx.load(e.target.result)
            console.log(workbook, 'workbok')
            const worksheet = workbook.worksheets[0]
            console.log(worksheet._merges)
            const dataRows = {}
            const cols = {}
            const style = []
            worksheet._columns.forEach((item, index) => {
              if (item['width']) {
                cols[item.number - 1] = {
                  width: item.width * 10
                }
              }
            })
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
              const cells = {}
              dataRows[rowNumber - 1] = {
                height: row.height || undefined,
                cells: cells
              }
              row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                // console.log('Cell ' + colNumber + ' = ' + cell.value);
                colNumber = colNumber - 1
                if (Excel.ValueType.Merge === cell.type) {
                  cells[colNumber] = {}
                  return
                }

                // 如果存在富文本编辑直接改为文本读取
                if (Object.prototype.toString.call(cell.value) === '[object Object]') {
                  let data = []
                  if ('richText' in cell.value) {
                    cell.value.richText.forEach(item => {
                      data.push(item.text)
                    })
                  }
                  cells[colNumber] = {
                    text: data.join('')
                  }
                } else {
                  cells[colNumber] = {
                    text: cell.value
                  }
                }
                if (typeof cell.style === 'object' && Object.keys(cell.style).length) {
                  cells[colNumber].style = this.getStyle(cell.style, style)
                }
              })
            })
            window.sheet.loadData({ rows: dataRows, merges: this.getMerge(worksheet, dataRows), styles: style,  cols: cols})
            // 读取附件
            this.$set(this.initData,'merges',this.getMerge(worksheet, dataRows))
            this.$set(this.initData,'rows',dataRows)
            this.$set(this.initData,'cols',cols)
            this.$set(this.initData,'styles',style)
            this.$emit('initRelate')
            resolve(file)
          }
          reader.readAsArrayBuffer(file)
        })
      },
    },
    destroyed () {
    },
    beforeDestroy () {
      delete window.sheet
    },
  }
</script>

<style lang="scss" scoped>
</style>
