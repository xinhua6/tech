<!--使用zrender,使用教程参考 https://ecomfe.github.io/zrender-doc/public/ -->
<template>
  <div class="c-h100">
    <div ref="flow"></div>
  </div>
</template>

<script>
  import zrender from 'zrender'
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
      this.init()
    },
    destroyed () {
      this.$_zrender && this.$_zrender.dispose()
    },
    methods: {
      init() {
        if (!this.$_zrender) {
          this.$_zrender = zrender.init(this.$refs.flow,{
            renderer:'canvas',       //渲染方式 支持'canvas','svg','vml'
            devicePixelRatio:1,      //画布大小与容器大小之比，仅当 renderer 为 'canvas' 时有效
            width:'auto',            //画布宽度
            height:'auto'            //画布高度
          }
            )
        }
        var rect=new zrender.Rect({
          style:{
            fill:'red',      //填充颜色
            stroke:'none'    //描边颜色
          },
          shape:{
            x:100,           //x,y代表坐标
            y:100,
            width:200,
            height:100,
            r:[3]            //圆角
          },
          z:1                   //层次，大的会覆盖小的
        });
        this.$_zrender.add(rect);
      }
    }

  }
</script>

<style scoped lang="scss">

</style>