import { API_URL, DEFAULT_DB_NAME } from 'src/config/index'
import { delWarn } from 'src/utils/fn'
import { getTempTokenId } from 'src/common/api'

export default {
  data () {
    return {
      // 数据主键值
      fileDataKey: 'kid',
      // 下载主键值
      fileKid: 'fileKid',
      dbName: DEFAULT_DB_NAME
    }
  },
  methods: {
    // 删除
    removeFile (val) {
      delWarn(this._delSubmit, null, val[this.fileDataKey])
    },
    // 预览
    previewFile (row) {
      this._getTempTokenId().then((r) => { this._look(row, r) })
    },
    // 下载文件
    downloadFile (row) {
      this._getTempTokenId().then((r) => { this._download(row, r) })
    },
    _download (row, userTempTokenId) {
      // window.location.href = (API_URL + '/WP-FILE/wpfile/download?kid=' + row[this.fileKid] + '&dbName=imis&&userTempTokenId=' + userTempTokenId)
      window.location.href = (`${API_URL}/WP-FILE/wpfile/download?kid=${row[this.fileKid]}&dbName=${this.dbName}&userTempTokenId=${userTempTokenId}`)
    },
    _delSubmit (val) {
      const sysMsg = this.$store.state[this.wpstore].sysMsg
      this.loading = true
      this.$axios({
        method: 'delete',
        url: 'WP-FILE/wpfile/delbykid',
        params: { [this.fileDataKey]: val, dbName: sysMsg.dbName || this.dbName }
      }).then((res) => {
        this.getFileList()
      }).finally(() => {
        this.loading = false
      })
    },
    _look (row, userTempTokenId) {
      const winHeight = window.innerHeight - 10
      const url = encodeURIComponent(API_URL + '/WP-FILE-PREVIEW' + row.relativePath + row.hash + row.ext)
      window.open(`${API_URL}/WP-FILE-PREVIEW/onlinePreview?url=${url}&userTempTokenId=${userTempTokenId}`,
        '_blank',
        `height=${winHeight},top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes`)
    },
    _getTempTokenId () {
      return new Promise((resolve, reject) => {
        getTempTokenId().then((res) => {
          resolve(res.data)
        })
      })
    }
  }
}
