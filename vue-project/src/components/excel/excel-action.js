export default {
  data () {
    return {
    }
  },
  computed: {
    styles() {
      return this.initData.styles
    }
  },
  methods: {
    // 设置行数据
    setRowData(worksheet) {
      for (let i in this.initData['rows']) {
        let rowData = []
        let row = this.initData['rows'][i]
        for (let j in row['cells']) {
          rowData[Number(j)+1] = row['cells'][j].text ?  row['cells'][j].text: ''
        }
        worksheet.addRow(rowData)
        // 设置行高,行数从1开始
        if (row.hasOwnProperty('height') && row['height']) {
          worksheet.getRow(Number(i)+ 1).height = row.height*0.7
        }
      }
    },

    // 设置单元格
    setCell(worksheet) {
      for (let i in this.initData['rows']) {
        let row = this.initData['rows'][i]
        for (let j in row['cells']) {
          let item = row['cells'][j]
          // 获取头部
          var index = this.setHead(i,j)
          worksheet.getCell(index).font = {}
          worksheet.getCell(index).fill = {}
          // 默认文字垂直水平居中,自动换行
          worksheet.getCell(index).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
          if (item.hasOwnProperty('style')) {
            this.setInitColor(worksheet,index)
            let cellStyle = this.styles[item['style']]
            for (let t in cellStyle) {
              switch (t) {
                case 'color':
                  let argb1 = cellStyle[t] ? this.setColor(cellStyle[t]) : '00000000'
                  worksheet.getCell(index).font['color'] = {argb : argb1}
                  break
                case 'font':
                  Object.assign(worksheet.getCell(index).font,cellStyle[t])
                  break
                case 'bgcolor':
                  let argb2 = cellStyle[t] ? this.setColor(cellStyle[t]) : '00ffffff'
                  // 直接使用bgColor无法填充，使用渐变来代替
                  worksheet.getCell(index).fill = {
                    // type: 'pattern',
                    // pattern:'lightTrellis',
                    // bgColor: {argb : argb2}
                    type: 'gradient',
                    gradient: 'angle',
                    degree: 0,
                    stops: [
                      {position:0, color:{argb:argb2}},
                      {position:0.5, color:{argb: argb2}},
                      {position:1, color:{argb: argb2}}
                    ]
                  }
                  break
                case 'underline':
                case 'strike':
                  worksheet.getCell(index).font[t] = cellStyle[t]
                  break
                case 'border':
                  worksheet.getCell(index).border = {}
                  for (let type in cellStyle[t]) {
                    worksheet.getCell(index).border[type] = {
                      style: cellStyle[t][type][0],
                      color: {argb : this.setColor(cellStyle[t][type][0])}
                    }
                  }
                  break
                case 'textwrap':
                  worksheet.getCell(index).alignment['wrapText'] = cellStyle[t]
                  break
                case 'align':
                  worksheet.getCell(index).alignment['horizontal'] = cellStyle[t]
                  break
                case  'valign':
                  worksheet.getCell(index).alignment['vertical'] = cellStyle[t]
                  break
                case 'format':
                  if (cellStyle[t] === 'percent') {
                    // worksheet.getCell(index).numFmt = '0.00%'
                    worksheet.getCell(index).value = worksheet.getCell(index).text + '%'
                  }
                  break
              }
            }
          }
          // if (item.hasOwnProperty('merge')) {
          //   this.setMerge(worksheet,i,j, item.merge)
          // }
        }
      }
    },
    // 起先设置所有单元格背景颜色为白色，必做，最后填补线框，做一个欺骗
    setInitColor(worksheet,index) {
      let argb = '00ffffff'
      // 直接使用bgColor无法填充，使用渐变来代替,
      worksheet.getCell(index).fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 0,
        stops: [
          {position:0, color:{argb:argb}},
          {position:0.5, color:{argb: argb}},
          {position:1, color:{argb: argb}}
        ]
      }
      worksheet.getCell(index).border = {
        top: {style:'thin', color: {argb:'00D4D4D4'}},
        left: {style:'thin', color: {argb:'00D4D4D4'}},
        bottom: {style:'thin', color: {argb:'00D4D4D4'}},
        right: {style:'thin', color: {argb:'00D4D4D4'}}
      }
    },

    setCellMerge(worksheet) {
      for (let i in this.initData['rows']) {
        let row = this.initData['rows'][i]
        for (let j in row['cells']) {
          let item = row['cells'][j]
          // 获取头部
          if (item.hasOwnProperty('merge')) {
            this.setMerge(worksheet,i,j, item.merge)
          }
        }
      }
    },

    setHead(i,j){
      var index = null
      if (j < 26) {
        index = `${String.fromCharCode(Number(j)+65)}${Number(i)+1}`
      } else {
        let num = Math.floor(j / 25)
        let ceil = j % 25
        index = String.fromCharCode(num-1+65) + String.fromCharCode(ceil-1+65) + `${Number(i)+1}`
      }
      return index
    },

    // 设置列宽
    setCol(worksheet) {
      if (Object.keys(this.initData['cols']).length === 0) return
      let col = []
      for (let i in this.initData['cols']) {
        if (!isNaN(i)) {
          worksheet.getColumn(Number(i)+1).width = this.initData['cols'][i].width ? this.initData['cols'][i].width/10 : 100
          // col.push({key: i, width: this.initData['cols'][i].width ? this.initData['cols'][i].width/4 : 100})
        }
      }
      // worksheet.columns = col
    },

    // 设置合并
    setMerge(worksheet, row, col, merge) {
      let startIndex = `${String.fromCharCode(Number(col)+65)}${Number(row)+1}`
      let endIndex = `${String.fromCharCode(Number(col)+65 + merge[1])}${Number(row)+1 + merge[0]}`
      worksheet.mergeCells(`${startIndex}: ${endIndex}`)
    },


    // 获取合并
    getMerge (worksheet, dataRows) {
      const merges = worksheet._merges
      return Object.keys(merges).map(key => {
        const data = merges[key]
        if (dataRows[data.top - 1] && dataRows[data.top - 1].cells[data.left - 1]) {
          dataRows[data.top - 1].cells[data.left - 1].merge = [data.bottom - data.top, data.right - data.left,]
        }
        return merges[key].range
      })
    },

    // 获取样式
    getStyle (excelStyle, allStyle) {
      const style = {}
      if (excelStyle.fill) {
        style.bgcolor = this.getThemeColor(excelStyle.fill.fgColor)
      }
      if (excelStyle.font) {
        style.font = Object.assign({}, excelStyle.font)
        style.color = this.getThemeColor(excelStyle.font.color)
      }
      // 默认全部单元格自动换行,水平居中
      style['textwrap'] = true
      style['align'] = true
      return (allStyle.push(style) - 1)
    },

    // 获取颜色  argb 转换为 #十六进制
    getThemeColor (color) {
      if (typeof color !== 'object') return
      if (color.argb) return '#' + color.argb.slice(-6)
      if (typeof color.theme !== 'undefined') return {
        0: '#FFFFFF',
        1: '#000000',
        2: '#eeece1',
        3: '#1f497d',
        4: '#4f81bd',
        5: '#c0504d',
        6: '#9bbb59',
        7: '#8064a2',
        8: '#4bacc6',
        9: '#f79646',
      }[color.theme]
    },

    // #十六进制转为 argb
    setColor(rgb) {
      return rgb.replace(/#/, '00')
    }

  }
}
