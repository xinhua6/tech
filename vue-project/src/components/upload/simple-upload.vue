<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      class="uploader-app">
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
          <div class="file-title">
            <h2>文件列表</h2>
            <div class="operate">
              <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                <i class="iconfont" :class="collapse ? 'icon-fullscreen': 'icon-minus-round'"></i>
              </el-button>
              <el-button @click="close" type="text" title="关闭">
                <i class="iconfont icon-close"></i>
              </el-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length"><i class="nucfont inuc-empty-file"></i> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
  import uploader from 'vue-simple-uploader'
  export default {
    name: "simple-upload",
    data() {
      return {
        options: {
          target: 'http://xxxxx/xx', // 目标上传 URL
          chunkSize: '2048000',   //分块大小
          fileParameterName: 'file', //上传文件时文件的参数名，默认file
          maxChunkRetries: 3,  //最大自动失败重试上传次数
          testChunks: true,     //是否开启服务器分片校验
          // 服务器分片校验函数，秒传及断点续传基础
          checkChunkUploadedByResponse: function (chunk, message) {
            let objMessage = JSON.parse(message);
            if (objMessage.skipUpload) {
              return true;
            }

            return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
          },
          headers: {
            // 在header中添加的验证，请根据实际业务来
            Authorization: "Bearer " + Ticket.get().access_token
          },
        },
        attrs: {
          // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
          accept: ACCEPT_CONFIG.getAll()
        },
        panelShow: false,   //选择文件后，展示上传panel
      }
    },
    components: {
      uploader
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
