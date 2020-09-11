import { getTempTokenId } from 'src/common/api/index.js'
import Excel from 'exceljs/lib/exceljs.browser'
import { API_URL } from 'src/config/index'
import Axios from 'axios'
import ExcelAction from './excel-action'
import menuEntryMixin from 'src/moudles/system-management/common/mixin/menu-entry-mixin.js'
export default {
  data() {
    return {
      initData: {},
      url: '/HMS-DATA/imisSupvReport',
      dbName: 'imis'
    }
  },
  mixins: [ExcelAction, menuEntryMixin],
  computed: {
    kid() {
      return this.formData.moduleFileKid
    }
  },
  methods: {
    filePreview () {
      return new Promise(resolve => {
        getTempTokenId().then((res) => {
          this.importExcel(res.data)
          resolve(res)
        })
      })

    },

    // 导入文件
    importExcel(userTempTokenId) {
      Axios.get(`${API_URL}/WP-FILE/wpfile/download`,{
        params: {
          kid: this.kid,
          dbName: this.dbName,
          userTempTokenId: userTempTokenId
        },
        headers: { 'Content-Type': 'application/json,charset=utf-8'},
        responseType: 'arraybuffer', //二进制流
      }).then((res) => {
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel,charset=utf-8' })
        let file = new window.File([blob], this.$route.query.rptName)
        this.importFile(file).then(_ => {
          // 保存initData
          this.exportFile()
          this.$emit('refresh')
        })
      })
    },

    // 导入excel
    importFile(file) {
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
          this.initData = { rows: dataRows, merges: this.getMerge(worksheet, dataRows), styles: style,  cols: cols}
          resolve(file)
        }
        reader.readAsArrayBuffer(file)
      })
    },


    // 保存initData
    exportFile() {
      this.$axios({
        method: 'post',
        url: this.url + '_saveAll',
        data: {
          kid: this.formData.kid,
          initData: JSON.stringify(this.initData)
        },
        loadingVm: this
      }).then( res => {
        this.$emit('refresh', res.data)
        if (this.isNext) {
          this.$emit('close')
          this.viewOrEidtOrSign('督办报表', this.formData.rptName, null, this.formData)
        }
      })
    },
  }
}
