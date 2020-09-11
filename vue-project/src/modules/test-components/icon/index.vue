<template>
  <div class="c-h100">
    <pre class="c-flex_1">
      图标的使用：尽量使用自己项目中所使用的组件框架中的自带icon，如果没有，可以有如下方法解决：
      方法一：直接下载svg图标替代，可以在编辑器中打开图片修改width和height，fill便可以直接更改大小和颜色
      方法二：使用iconfont，在项目中导入在线连接，直接使用font-class。缺点：如果存在查漏，增加后链接会更新，不利于后期维护
      方法三：纯css制作图标，参考张鑫旭的css图标库，适用于简单的图标

      参考：
      [1] <a href="https://blog.csdn.net/SmileLvCha/article/details/86495431">iconfont图标转为css代码</a>
      [2] <a href="https://yq.aliyun.com/articles/519353">阿里巴巴iconfont的正确使用方式</a>
      [3] <a href="https://www.zhangxinxu.com/wordpress/2019/08/pure-css-icon/">张鑫旭css图标的代码分离与整理</a>
    </pre>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
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