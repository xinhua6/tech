<template>
  <div class="attch">
    <!--新增时的附件列表样式-->
    <div v-if="!isView" class="attch-warp">
      <slot name="add">
        <div @click="add" v-if="!isView && list.length < limit" class="attch-warp-add s-c">添加附件</div>
      </slot>
      <div>
        <!-- 删除文件 -->
        <div v-for="item in list">
          <div class="file-show c-jc_sb">
            <div class="file-down" @click="preview(item)">{{item.title}}</div>
            <slot :index="list.indexOf(item)"></slot>
            <i class="el-icon-close file-img" style="padding: 5px 0;" v-if="!isView" @click="remove(item)"></i>
          </div>
        </div>
        <!-- 追加文件 -->
        <div v-for="item in append">
          <div class="file-show">
            <div class="file-down" @click="preview(item)">{{item.fileName}}</div>
            <i class="el-icon-close file-img" style="padding: 5px 0;" v-if="!isView" @click="delFile(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <!--查看时的附件列表样式-->
    <div v-if="isView" class="warp">
      <div class="list1 el-input__inner1">
        <div class="list1-border" v-for="item in list">
          <div class="file-show" v-if="!isSign">
            <div class="file-down" @click="preview(item)">{{item.title}}</div>
            <img class="file-img" @click="fileDown(item)" src="~./file-down.png" alt="" title="下载">
          </div>
          <el-tooltip class="item" effect="dark" placement="top-start" v-else :key="item.md5">
            <div slot="content">{{item.userName}}&nbsp&nbsp&nbsp{{item.addDate}}</div>
            <div class="file-show">
              <div class="file-down" @click="preview(item)">{{item.title}}</div>
              <img class="file-img" @click="fileDown(item)" src="~./file-down.png" alt="" title="下载">
            </div>
          </el-tooltip>
        </div>
        <div v-if="list.length === 0" style="padding-top: 3px;font-size: 1.4rem" class="s-c">无数据</div>
      </div>
    </div>
    <upload v-if="uploadShow"
            :limit="limit"
            v-bind="$attrs"
            :show.sync="uploadShow"
            :params="params"
            :data="uploadParams"
            @update="getFileList"
            @fileRemove="delSubmit"
    ></upload>
  </div>
</template>
<script>
  /**
   * 附件上传
   */
  import upload from '../upload/upload.vue'
  import { delWarn } from 'src/utils/fn'
  import { API_URL, DEFAULT_DB_NAME } from 'src/config/index'

  export default {
    name: 'attachFile',
    components: {
      upload
    },
    props: {
      dbName: {
        default: DEFAULT_DB_NAME
      },
      recordId: {
        type: String,
        requried: true
      },
      otherRecordId: {
        type: String,
        default: null
      },
      page: {
        type: String,
        default: 'view'
      },
      isSign: {
        type: Boolean,
        default: false
      },
      fileRemark: {
        type: String,
        default: null
      },
      params: {
        type: Object,
        default () {
          return {}
        }
      },
      // 文件上传个数
      limit: {
        type: Number,
        default: 10000
      }
    },
    data () {
      return {
        uploadShow: false,
        list: [],
        otherlist: [],
        append: []
      }
    },
    watch: {
      recordId (val) {
        this.getFileList()
      },
      otherRecordId (val) {
        // console.log(val, 'ppppppppp')
        this.$axios({
          url: 'WP-FILE/wpfile/findall',
          params: {
            dbName: 'imis',
            recordId: val,
            isSign: 0,
            orderSort: 'ASC'
          },
          customError: true
        }).then((res) => {
          if (res.success) {
            this.otherlist = res.data.filter(item => {
              const signFile = this.isSignFile(item)
              if (this.fileRemark) {
                return signFile
              } else {
                return !signFile
              }
            })
            this.list = this.list.concat(this.otherlist)
          }
        })
      }
    },
    computed: {
      isView () {
        return this.page === 'view' || this.page === 'sign'
      },
      // 上传所需的参数
      uploadParams () {
        return {
          dbName: this.dbName,
          recordId: this.recordId,
          isSign: this.isSign ? 1 : 0,
          orderSort: 'ASC',
          ...this.params
        }
      }
    },
    mounted () {
      // console.log(this.fileRemark, 'this.fileRemark')
      if (this.page === 'add') {
        return
      }
      this.getFileList()
    },
    methods: {
      add () {
        this.uploadShow = true
      },
      // 删除全部文件
      delAll () {
        if (this.list.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.delSubmit(this.list[i].kid)
          }
        }
      },
      // 删除
      remove (val) {
        delWarn(this.delSubmit, this.OldList, val.kid)
      },

      //  删除追加文件
      delFile (val) {
        delWarn(this.delAppend, this.OldList, val)
      },

      delAppend (val) {
        this.$emit('delAppend', val)
        this.append.splice(this.append.findIndex(item => val.kid === item.kid), 1)
      },

      OldList () {

      },
      delSubmit (val) {
        this.loading = true
        this.$axios({
          method: 'delete',
          url: 'WP-FILE/wpfile/delbykid',
          params: { kid: val}
        }).then((res) => {
          this.getFileList()
          this.$emit('delFile')
        }).finally(() => {
          this.loading = false
        })
      },
      getFileList: function () {
        this.loading = true
        this.$axios({
          url: 'WP-FILE/wpfile/findall',
          params: this.uploadParams,
          customError: true
        }).then((res) => {
          if (res.success) {
            this.list = res.data.filter(item => {
              const signFile = this.isSignFile(item)
              if (this.fileRemark) {
                return signFile
              } else {
                return !signFile
              }
            })
            this.total = res.total
            this.$emit('getFileName', res.data)
            this.list = this.list.concat(this.otherlist)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 预览
      preview (row) {
        this.getTempTokenId().then((r) => { this.look(row, r) })
      },
      look (row, userTempTokenId) {
        console.log(row)
        let winHeight = window.clientHeight - 10
        let url = encodeURIComponent(API_URL + '/WP-FILE-PREVIEW' + row.relativePath + row.hash + row.ext)
        window.open(API_URL + '/WP-FILE-PREVIEW/onlinePreview?url=' + url + '&userTempTokenId=' + userTempTokenId, '_blank', 'height=' + winHeight +
          ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
      },
      getTempTokenId () {
        let that = this
        return new Promise((resolve, reject) => {
          that.$axios({
            method: 'get',
            url: 'WP-FILE/wpfile/usertemptokenid'
          }).then((res) => {
            resolve(res.data)
          })
        })
      },
      isSignFile (fileMsg) {
        return fileMsg.remark && fileMsg.remark.indexOf(this.fileRemark) !== -1
      },
      fileDown (row) {
        this.getTempTokenId().then((r) => { this.download(row, r) })
      },
      // 下载文件
      download (row, userTempTokenId) {
        // window.location.href = (API_URL + '/WP-FILE/wpfile/download?kid=' + row.kid + '&dbName=imis&&userTempTokenId=' + userTempTokenId)
        window.location.href = (`${API_URL}/WP-FILE/wpfile/download?kid=${row.kid}&dbName=${this.dbName}&userTempTokenId=${userTempTokenId}`)
      }
    }
  }
</script>
<style scoped lang="scss">
  .warp {
    display: flex;
  }

  .list {
    flex: 1;
    border-radius: 2px 0 0 2px;
    overflow: auto;
  }

  .file {
    display: inline-block;
    margin-right: 15px;
    background: #F6F6F6;
    padding: 0 5px;
  }

  .btn {
    width: 60px;
    line-height: 35px;
    border-radius: 0 2px 2px 0;
    border-left-width: 0;
    padding: 0;
    font-size: 14px;
    vertical-align: middle;
    text-align: center;
  }

  .list1 {
    width: 100%;
    .list1-border {
      padding: 10px;
      border-bottom: 1px solid #E9EFF3;
    }
    .list1-border:last-child {
      border: none;
    }
  }

  .file-show {
    display: flex;
    cursor: pointer;
    padding: 5px 0;
    /*align-items: center;*/
    /*justify-content: center;*/
  }

  .file-down {
    width: 40%;
    padding: 5px 0;
    font-size: 1.4rem;
    color: #606266;
  }

  .file-down:hover {
    background: #e7f3fd;
  }

  .file-img {
    width: 1.5rem;
    height: 1.5rem;
  }

  .attch-warp-add {
    cursor: pointer;
    font-size: 1.4rem;
  }
</style>
