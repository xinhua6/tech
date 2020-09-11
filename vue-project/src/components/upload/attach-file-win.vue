<template>
  <wp-window :closed="!show"
             @on-closed="close"
             :title="winTitle"
             width="80%"
             height="75%"
             :loading="loading"
  >
    <xdh-table :data="tableData"
               :columns="columns"
               height="100%"
               v-loading="loading"
               highlight-current-row
    >
      <template slot="kid" slot-scope="scope">
        <a v-if="page==='edit'" style="color:deepskyblue" @click="del(scope.row)">删除</a>
        <a style="color:deepskyblue" @click="look(scope.row)">预览</a>
        <a style="color:deepskyblue" @click="download(scope.row)">下载</a>
      </template>

    </xdh-table>
    <template v-slot:footer>
      <wp-detail-toolbar page="view"></wp-detail-toolbar>
    </template>
  </wp-window>
</template>

<script>
  import { mapAppGetters } from 'src/store/store'
  import XdhTable from 'src/widgets/xdh-table'
  import { API_URL } from 'src/config/index'
  const PREVIEW_URL = 'http://121.12.120.212:8138'
  export default {
    name: 'WpAttachFileWin',
    components: { XdhTable },
    mixins: [],
    props: {
      show: Boolean,
      title: String,
      recordId: {
        type: String,
        required: true
      },
      dbName: String,
      // 页面状态
      page: {
        type: String,
        default: 'edit'
      }
    },
    created () {
      this.$dbName = this.dbName || this.$store.state.user.activeSystemName
      this.$mdTypeId = '105'
      this.getUploadData()
    },
    computed: {
      winTitle () {
        return this.title + '附件详细'
      }
    },
    watch: {},
    data () {
      return {
        tableData: [],
        loading: false,
        columns: [
          {
            prop: 'title',
            label: '文件名'
          },
          {
            prop: 'length',
            label: '大小(字节)'
          },
          {
            prop: 'userName',
            label: '上传人'
          },
          {
            prop: 'addDate',
            label: '上传时间'
          }, {
            prop: 'kid',
            label: '操作'
          }
        ]
        // dbName
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
      },
      getUploadData () {
        this.loading = true
        this.$axios({
          method: 'get',
          url: FILE_URL + '/wpfile/findall',
          data: {
            recordId: this.recordId,
            dbName: this.$dbName
          }
        }).then((res) => {
          if (res.success) {
            this.tableData = res.data
            this.total = res.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      look (row, userTempTokenId) {
        var winHeight = window.document.documentElement.clientHeight - 10
        let url = encodeURIComponent(PREVIEW_URL + '' + row.relativePath + row.hash + row.ext)
        window.open(PREVIEW_URL + '/onlinePreview?url=' + url + '&mdTypeId=' + this.$mdTypeId + `&dbName=${this.$dbName}`, '_blank', 'height=' + winHeight +
          ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
      },
      del (row) {
        this.$delWarn(this.delSubmit, null, row.kid)
      },
      delSubmit (val) {
        this.loading = true
        this.$axios({
          method: 'delete',
          url: FILE_URL + '/wpfile/delbykid',
          data: { kid: val, dbName: this.$dbName }
        }).then((res) => {
          if (res.success) {
            this.getUploadData()
          }
        }).finally(() => {
          this.loading = false
        })
      },
      download (row, userTempTokenId) {
        window.location.href = (FILE_URL + '/wpfile/download?kid=' + row.kid + '&dbName=' + this.$dbName)
      },
      return () {
        this.close()
      }
    }
  }
</script>

<style scoped>
  a {
    margin-left: 5px;
  }
</style>
