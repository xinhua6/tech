<template>
  <div style="height: 100%;width:100%;overflow: auto" class="c-fd_c">
    <div class="c-flex">
      <el-button @click="saveExcel" size="mini">导出excel</el-button>
      <el-button size="mini" style="position: relative">
        导入excel
        <input type="file" @change="importExcel" accept=".xlsx,.xls"
               style="position: absolute;opacity: 0;top:0;left: 0;width: 80px;height: 32px"/>
      </el-button>
      <div class="icon c-tvc" :style="{borderBottom: `3px solid ${fontColor}`}" @click="changeFontColor">A</div>
      <div  class="c-fd_c" style="justify-content: center">
        <svg class="icon " aria-hidden="true" @click="changeBground('backgroundColor',bgColor)">
          <path d="M7.963 5.25H4.941V4h4.272l.808-.808a.5.5 0 01.707 0l6.364 6.364a.5.5 0 010 .707l-7.071 7.071a.5.5 0 01-.707 0L2.95 10.97a.5.5 0 010-.707L7.963 5.25zm-3.599 5.367h10.607l.707-.707-5.304-5.304-6.01 6.01zM17.941 11l.867 1.76a1.34 1.34 0 010 1.163c-.179.36-.508.587-.867.597-.36-.01-.689-.236-.867-.597a1.338 1.338 0 010-1.163L17.94 11z" fill="#5C5C5C" fill-rule="evenodd"></path>
        </svg>
        <div style="width: 20px;margin:0 10px;border-bottom:3px solid #ffff00"></div>
        <el-color-picker v-model="bgColor" v-if="false"></el-color-picker>
      </div>
      <el-select v-model="fontSize" size="small" style="width: 80px" @change="fontSizeChange">
        <el-option v-for="item in 10" :key="item" :value="item + 9">{{ item + 9}}</el-option>
      </el-select>
    </div>

    <handsontable-compent :options="options" @ready="beforeInit" class="c-flex1"></handsontable-compent>
    <div v-if="sheetNames.length > 0" style="width: 100%;background: #f0f0f0;padding-left: 50px">
      <template v-for="name in sheetNames">
        <el-button size="small"
                   :key="name"
                   :type="name === activeSheet ? 'primary' : ''"
                   @click="showTabSheet(name)">
          {{ name}}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
  import HandsontableCompent from 'src/components/handsontable'
  import Handsontable from 'handsontable'
  import XLSX from 'xlsx'

  export default {
    name: 'index',
    components: {HandsontableCompent},
    data () {
      return {
        activeSheet: 'sheet1',
        sheetNames: ['sheet1'],
        fontColor: 'red',
        bgColor:'#ffff00',
        fontSize:10
      }
    },
    computed: {
      options () {
        return {
          // data: [
          //   ['列', '测试', 'Volvo', 'Toyota', 'Honda'],
          //   ['2016', 10, 11, 12, 13],
          //   ['2017', 20, 11, 14, 13],
          //   ['2018', 30, 15, 12, 13]
          // ],
          // width: 1000,
          // height: 600,
          startRows: 100,
          startCols: 20,
          colHeaders: true,
          rowHeaders: true,
          manualColumnResize: true,
          manualRowResize: true,
          colWidths: 100,
          mergeCells: true,
          // className: 'htCenter',
          contextMenu: true,
          language: 'zh-CN',
          beforeInit: this.beforeInit,
          afterMergeCells: this.afterMergeCells,
          afterSelection: this.afterSelection,
          deselected:this.deselected,
          renderer: this.renderer
        }
      }
    },
    mounted () {
      // this.renderCanvas()
    },
    methods: {
      renderer (instance, td, row, col, prop, value, cellProperties) {
        // 渲染为text类型，可选的有TimeRenderer、PasswordRenderer等不同的类型
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        const style = td.style
        style.color = cellProperties.color
        style.fontSize = cellProperties.fontSize
        style.backgroundColor = cellProperties.backgroundColor
      },
      changeStyle(key,value){
        if(this.selectRange.length){
          const select = this.selectRange
          for(let i = select[0]; i <= select[2]; i ++){
            for(let j = select[1]; j <= select[3]; j ++){
              this.$_hot.setCellMeta(i,j,key,value)
            }
          }
          this.$_hot.selectCell(...select)
          this.$_hot.render()
        }

      },
      fontSizeChange(){
        this.changeStyle('fontSize',this.fontSize + 'px')
      },
      changeBground(){
        this.changeStyle('backgroundColor',this.bgColor)
      },
      changeFontColor(){
        this.changeStyle('color',this.fontColor)
      },
      beforeInit (hot) {
        this.$_hot = hot
        if (process.env.NODE_ENV === 'development') {
          window.hot = hot
        }
      },
      deselected(){
        console.log('deselected')
        this.selectRange = []
      },
      afterSelection (row, col, rowEnd, colEnd) {
        this.selectRange = [row, col, rowEnd, colEnd]
        console.log(this.selectRange)
      },
      afterMergeCells () {
        // console.log(arguments)
        // getPlugin('MergeCells').mergedCellsCollection.mergedCells
      },
      saveExcel () {
        const sheetName = 'testname'
        const hot = this.$_hot
        const wb = XLSX.utils.book_new()
        const sheet = XLSX.utils.aoa_to_sheet(hot.getData())
        sheet['!merges'] = this.getXlsxMergeMsg(hot)
        sheet['!cols'] = this.getXlsxColWidth(hot)
        sheet['!rows'] = this.getXlsxRowHeight(hot)
        XLSX.utils.book_append_sheet(wb, sheet, sheetName)
        XLSX.writeFile(wb, `${sheetName}.xlsx`)
        // console.log(wb, 'wb')
      },
      importExcel (e) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const wb = XLSX.read(e.target.result, {type: 'buffer', cellStyles: true})
          console.log(wb, 'savetoview-wb')
          this.sheetNames = wb.SheetNames
          this.$_wb = wb
          this.showTabSheet(wb.SheetNames[0])
        }
        reader.onabort = (e) => {
          console.warn(e, '读取excel意外终止')
        }
        reader.readAsArrayBuffer(e.target.files[0])
      },
      excelToView (sheet) {
        const hot = this.$_hot
        const data = XLSX.utils.sheet_to_json(sheet, {header: 'A'})
        const viewData = []
        let maxIndex = 0
        data.forEach(row => {
          const data = []
          Object.keys(row).forEach(key => {
            const index = this.getIndexFormAlahebel(key)
            data[index] = row[key]
            if (maxIndex < index) maxIndex = index
          })
          viewData[row.__rowNum__] = data
        })
        // 根据测试 第一行的数据长度为总列数
        viewData[0].length = maxIndex + 3
        viewData.push([], [], [])
        // console.log(data, viewData)
        hot.updateSettings({
          data: viewData,
          startRows: 100,
          startCols: 10,
          colWidths: this.getViewColWidth(sheet),
          rowHeights: this.getViewRowHeight(sheet),
          mergeCells: this.getViewMergeMsg(sheet)
        })
      },
      getViewColWidth (sheet) {
        if (sheet['!cols']) {
          return sheet['!cols'].map(item => item.wpx)
        }
      },
      getViewRowHeight (sheet) {
        if (sheet['!rows']) {
          return sheet['!rows'].map(item => item.hpx)
        }
      },
      getViewMergeMsg (sheet) {
        if (sheet['!merges']) {
          return sheet['!merges'].map(msg => {
            const start = msg.s
            const end = msg.e
            return {row: start.r, col: start.c, rowspan: end.r - start.r + 1, colspan: end.c - start.c + 1}
          })
        }
        return []
      },
      getXlsxColWidth (hot) {
        const widths = hot.getPlugin('ManualColumnResize').manualColumnWidths
        return widths.map(width => ({wpx: width}))
      },
      getXlsxRowHeight (hot) {
        const heights = hot.getPlugin('manualRowResize').manualRowHeights
        return heights.map(height => ({hpx: height}))
      },
      getXlsxMergeMsg (hot) {
        const mergeCells = hot.getPlugin('MergeCells').mergedCellsCollection.mergedCells
        return mergeCells.filter(cell => (cell.rowspan !== 1 || cell.colspan !== 1))
          .map(cell => ({
            s: {c: cell.col, r: cell.row},
            e: {c: cell.col + cell.colspan - 1, r: cell.row + cell.rowspan - 1}
          }))
      },
      getIndexFormAlahebel (name) {
        let index = -1
        for (let i = 0; i < name.length; i++) {
          index = (index + 1) * 26 + name.charCodeAt(i) - 65
        }
        return index
      },
      showTabSheet (name) {
        this.activeSheet = name
        this.excelToView(this.$_wb.Sheets[name])
      },
      renderTable () {
        const table = this.$refs.table
        for (var i = 0; i < 100; i++) {
          var row = table.insertRow(-1)
          for (var j = 0; j < 26; j++) {
            var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1)
            row.insertCell(-1).innerHTML = i && j ? '' : i || letter
          }
        }
      },
      renderCanvas () {
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext('2d')
        // 定义每个小格的宽高
        var rectH = 50
        var rectW = 50
        canvas.height = 10000
        // 绘制横线
        for (var i = 0; i < 10000; i++) {
          ctx.moveTo(0, i * rectH)
          ctx.lineTo(canvas.width, i * rectH)
        }
        // 绘制竖线
        for (var j = 0; j < 10000; j++) {
          ctx.moveTo(j * rectW, 0)
          ctx.lineTo(j * rectW, canvas.height)
        }
        ctx.lineWidth = 0.5
        ctx.strokeStyle = '#555'
        ctx.stroke()
        console.time('fillText')
        for (let i = 0; i < 200; i++) {
          for (let j = 0; j < 200; j++) {
            ctx.fillText(`${j}--${i}`, i * rectW, j * rectH - 10)
          }
        }
        console.timeEnd('fillText')
      }
    }
  }
</script>

<style scoped lang="scss">
  .font-color {

  }
  .icon{
    font-size: 16px;
    margin: 0 10px;
    cursor: pointer;
    height: 20px;
    width: auto;
    max-width: 20px;
  }
</style>
