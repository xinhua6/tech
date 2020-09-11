<template>
  <div class="c-h100">
    <ul>
      <li>
        <div>封装axios请求</div>
        <pre class="copyable">
          <div class="c-fd_rr c-cp" @click="copyText('copy1')">
            <i class="el-icon-document-copy"></i>
          </div>
          <code ref="copy1">
            this.$axios({
              method: 'post' || 'get',
              url: '',
              params: { ....},
              _ignore: true,
              customError: true,
              delPending: true
              cache: true,
              loadingVM: true
            }).then(res => {
              ...
            }).finally(e => {
              ...
            })
          </code>
          参数说明:
            1. 基础配置
              method: String，请求方法，常用get和post
              url: String，请求地址
              params: Object，请求参数
            2. 可选配置
              _ignore: Boolean,是否允许请求头部携带authorization
              customError: Boolean, 是否自行处理后台返回fasle的情况
              delPending: Boolean, 是否取消相同请求不同参数处于pending状态下的请求
              cache: boolean/Object, Object: {local, session, key}
               local:Boolean 数据是否保存到localStorage，
               session:Boolean 数据是否保存到SessionStorage
               update:Boolean ,true 更新缓存
               key：缓存的key，默认取url+query
               time: Number 毫秒数 缓存时长
              loadingVM: this，结合v-loading使用
        </pre>
      </li>
      <li>
        <div>相同地址连续发送请求且按顺序接收,使用promise.all</div>
        <pre class="copyable">
          <div class="c-fd_rr c-cp" @click="copyText('copy2')">
            <i class="el-icon-document-copy"></i>
          </div>
          <code ref="copy2">
            function(params) {
              const reqAll = params.map((item) => {
                 return new Promise(resolve => {
                   this.$axios({
                     method: '',
                     url: ''，
                     params: item
                   }).then((res) => {
                     resolve(res.data)
                   })
                 })
              })
               Promise.all(reqAll).then((datas) => {
                 console.log(datas)
                 return datas
               })
            },
          </code>
        </pre>
      </li>
    </ul>
  </div>
</template>

<script>
  import VueClipboard from 'vue-clipboard2'
  export default {
    name: "index",
    data() {
      return {}
    },
    computed: {
      axios() {
        return {

        }
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      copyText(val) {
        const message = this.$refs[val].innerHTML
        this.$copyText(message).then((e) => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
          console.log(e)
        }, (e) => {
          this.$message.error('复制失败')
          console.log(e)
        })
      }
    }

  }
</script>

<style scoped>

</style>