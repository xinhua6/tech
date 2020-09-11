<!--el-upload的分片，断点上传封装 针对文件大于500M的进行分片-->
<template>
  <el-upload
    drag
    multiple
    :auto-upload="true"
    :http-request="checkedfile"
    :before-remove="removefile"
    :limit="10"
    action="/"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
      }
    },
    props: {
      // 上传最大文件限制 5G
      maxsize: {
        type: Number,
        default: 5 * 1024 * 1024 * 1024
      },
      // 大于这个大小的文件使用分块上传(后端可以支持断点续传) 500M
      multiuploadsize: {
        type: Number,
        default: 500 * 1024 * 1024
      },
      // 每块文件大小5M
      eachsize: {
        type: Number,
        default: 500 * 1024 * 1024
      },
      // 请求方法队列（调用取消上传）
      requestcancelqueue: {
        type: Array,
        default: []
      }
    },
    mounted () {
    },
    methods: {
      async checkedfile (options) {
        const { file, onprogress, onsuccess, onerror } = options
        if (file.size > this.maxsize) {
          return this.$message({
            message: `您选择的文件大于${this.getsize(maxsize)}`,
            type: 'error'
          })
        }
        const uploadfunc = file.size > this.multiuploadsize ? this.splitupload : this.singleupload
        try {
          await uploadfunc(file, onprogress)
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          onsuccess()
        } catch (e) {
          console.error(e)
          this.$message({
            message: e.message,
            type: 'error'
          })
          onerror()
        }
        const prom = new promise((resolve, reject) => {})
        prom.abort = () => {}
        return prom
      },
      // 格式化文件大小显示文字
      getsize (size) {
        return size > 1024
          ? size / 1024 > 1024
            ? size / (1024 * 1024) > 1024
              ? (size / (1024 * 1024 * 1024)).tofixed(2) + 'gb'
              : (size / (1024 * 1024)).tofixed(2) + 'mb'
            : (size / 1024).tofixed(2) + 'kb'
          : (size).tofixed(2) + 'b'
      },
      // 单文件直接上传
      singleupload (file, onprogress) {
        return this.postfile({ file, uid: file.uid, filename: file.filename }, onprogress)
      },
      // 大文件分块上传
      splitupload (file, onprogress) {
        return new promise(async (resolve, reject) => {
          try {
            const chunks = math.ceil(file.size / this.eachsize)
            const filechunks = await this.splitfile(file, this.eachsize, chunks)
            let currentchunk = 0
            for (let i = 0; i < filechunks.length; i++) {
              // 服务端检测已经上传到第currentchunk块了，那就直接跳到第currentchunk块，实现断点续传
              console.log(currentchunk, i)
              if (number(currentchunk) === i) {
                // 每块上传完后则返回需要提交的下一块的index
                currentchunk = await this.postfile({
                  chunked: true,
                  chunk: i,
                  chunks,
                  eachsize,
                  filename: file.name,
                  fullsize: file.size,
                  uid: file.uid,
                  file: filechunks[i]
                }, onprogress)
              }
            }
            const isvalidate = await this.validatefile({
              chunks: filechunks.length,
              filename: file.name,
              fullsize: file.size,
              uid: file.uid
            })
            if (!isvalidate) {
              throw new error('文件校验异常')
            }
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      },
      // 文件分块,利用array.prototype.slice方法
      splitfile (file, eachsize, chunks) {
        return new promise((resolve, reject) => {
          try {
            settimeout(() => {
              const filechunk = []
              for (let chunk = 0; chunks > 0; chunks--) {
                filechunk.push(file.slice(chunk, chunk + eachsize))
                chunk += eachsize
              }
              resolve(filechunk)
            }, 0)
          } catch (e) {
            console.error(e)
            reject(new error('文件切块发生错误'))
          }
        })
      },
      removefile (file) {
        this.requestcancelqueue[file.uid]()
        delete this.requestcancelqueue[file.uid]
        return true
      },
      // 提交文件方法,将参数转换为formdata, 然后通过axios发起请求
      postfile (param, onprogress) {
        const formdata = new formdata()
        for (let p in param) {
          formdata.append(p, param[p])
        }
        const config = {
          canceltoken: new axios.canceltoken(function executor (cancel) {
            if (this.requestcancelqueue[param.uid]) {
              this.requestcancelqueue[param.uid]()
              delete this.requestcancelqueue[param.uid]
            }
            this.requestcancelqueue[param.uid] = cancel
          }),
          onuploadprogress: e => {
            if (param.chunked) {
              e.percent = number(((((param.chunk * (param.eachsize - 1)) + (e.loaded)) / param.fullsize) * 100).tofixed(2))
            } else {
              e.percent = number(((e.loaded / e.total) * 100).tofixed(2))
            }
            onprogress(e)
          }
        }
        return axios.post('', formdata, config).then(rs => rs.data)
      },
      // 文件校验方法
      validatefile (file) {
        return axios.post('', file).then(rs => rs.data)
      }
    }
  }
</script>
