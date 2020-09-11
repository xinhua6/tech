<template>
  <wp-window :closed="!show" :title="title" @on-closed="close">
    <el-upload
      v-bind="$attrs"
      ref="upload"
      class="c-upload"
      :show-file-list="true"
      :auto-upload="true"
      :file-list="fileList"
      :headers="headers"
      drag
      :data="uploadData"
      :action="action"
      :on-error="error"
      :on-success="success"
      :on-remove="fileRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :multiple="multiple">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="msg">{{msg}}</div>
    </el-upload>
    <div v-if="params.tableId && content" class="content">附件：<pre>{{content}}</pre></div>
    <div slot="footer">
      <el-button @click="close" size="mini">关闭</el-button>
      <!--<el-button @click="close">{{count === 0 ?  '返回' : '取消'}}</el-button>-->
      <!--<el-button type="primary" @click="ok">确 定</el-button>-->
    </div>
  </wp-window>
</template>
<script>
  import { API_URL } from 'src/config/index'
  import { getMenuTableId } from 'src/utils/fn'

  export default {
    props: {
      show: Boolean,
      title: {
        type: String,
        default: '附件上传'
      },
      url: {
        type: String,
        default: '/WP-FILE/wpfile/upload'
      },
      data: {
        type: Object,
        default: function () {
          return {}
        }
      },
      multiple: {
        type: Boolean,
        default: true
      },
      params: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
        fileList: [],
        tableId: null,
        msg: '',
        count: 0,
        update: false,
        content: null
      }
    },
    computed: {
      action: function () {
        return API_URL + this.url
      },
      uploadData () {
        const user = this.$store.state.user.userData
        return Object.assign({
          dbName: this.dbName,
          projId: user.projId || 0,
          tableId: this.tableId,
          mdTypeId: this.mdTypeId
        }, this.data)
      }
    },
    created () {
      // console.log(this.params, 'ppppppppppppp')
      if (this.params.tableId) {
        this.instanceList()
      }
      // 缓存系统数据
      const sysMsg = this.$store.state[this.wpstore].sysMsg
      this.tableId = getMenuTableId.call(this)
      this.dbName = sysMsg.dbName
      this.mdTypeId = sysMsg.mdSystem
    },
    methods: {
      beforeRemove (file) {
        return this.$confirm(`此操作将永久删除数据, 是否继续?`)
      },
      fileRemove (file) {
        this.$emit('fileRemove', file.response.data.kid)
        // console.log(file.response.data);
      },
      beforeUpload (file) {
        this.count++
        return this.isFile(file)
      },
      error (err, file, fileList) {
        this.count--
      },
      clear () {
        this.$refs.upload.clearFiles()
      },
      // console.log(err, file, fileList, '文件错误')
      success (response, file, fileList) {
        this.count--
        this.update = true
        if (!response.success) {
          this.msg = response.msg
          if (!response.success) {
            file.status = null
            file.name = file.name + '    ' + '上传失败'
          }
        }
        if (!response.code || response.code !== 1) {
          fileList.pop()
          this.msg = response.msg || '上传失败'
        }
      },
      isFile (f) {
        let that = this
        let fileName = f.name
        if (fileName.indexOf('.') === -1) { // 没有后缀
          that.msg = '文件格式不支持'
          return false
        }
        if (fileName.indexOf(',') !== -1 || fileName.indexOf('，') !== -1) {
          that.msg = '文件名中不能含有中英文逗号'
          return false
        }
        if (that.$attrs.accept) {
          let fileTypes = that.$attrs.accept.split(',')
          if (!fileTypes.some(item => item === f.type)) {
            that.msg = '选择文件类型错误'
            this.count--
            return false
          }
        }

        // if (f.size > 500 * 1024 * 1024) {
        //   this.msg = '上传文件不能超过500M,建议在100M之内'
        //   return false
        // } else {
        let reader = new FileReader()
        return new Promise((resolve, reject) => {
          try {
            reader.onload = function (e) {
              resolve()
            }
            reader.onerror = function (e) {
              reject()
              this.count--
              console.log(e, 'error，不可以上传文件夹')
            }
            reader.readAsText(f)
          } catch (e) {
            console.error(e)
            this.count--
            reject()
          }
        })
        // }
      },
      handleExceed(files,fileList) {
        this.$message.warning(`当前限制选择 ${this.$attrs.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      close () {
        if (this.count) {
          this.$confirm('文件正在上传,确认关闭？')
            .then(_ => {
              this.$emit('update:show', false)
            })
            .catch(_ => {})
        } else {
          this.$emit('update:show', false)
        }
      },
      // 默认示例查询
      instanceList () {
        this.$axios({
          method: 'get',
          url: '/HMS/imisInstanceList_query',
          params: {
            tableId: this.params.tableId,
            contentTypeId: 2,
            fileTypeId: this.params.fileTypeId
          }
        }).then(res => {
          if (res.data.length > 0) {
            console.log(res.data[0].content, 'res.data[0].contentres.data[0].content')
            this.content = res.data[0].content
          }
        })
      }
    },
    beforeDestroy () {
      this.update && this.$emit('update', true)
    }
  }
</script>
<style lang="scss">
  .c-upload {
    text-align: center;
    .el-upload {
      width: 100%;
      padding: 10px;
    }
    .el-upload-dragger {
      width: 100%;
      height: 100px;
      .el-icon-upload {
        margin-top: 10px;
      }
    }

  }
</style>
<style scoped>
  .msg {
    color: red;
    font-size: 14px;
    text-align: left;
    text-indent: 26px;
    line-height: 1.5;
  }
  .content{
    padding: 10px;
    line-height: 1.5;
  }
</style>
