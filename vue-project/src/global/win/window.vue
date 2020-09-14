<template>
  <div class="main wp-window" :class="mainClass" :style="max ? winStyle : style" ref="window" v-if="!closed">
    <div class="c-h100 c-fd_c">
      <!--v-drag="headDrag"-->
      <div class="header s-c c-jc_sb" v-if="hasHeader" :style="headerStyle">
        <div class="title">
          <slot name="title">{{title}}</slot>
        </div>
        <div class="tools c-tvc">
          <slot name="tools">
          </slot>
          <div  @click="changeSize" class="c-cp icon">
            <img v-if="this.max" :src="iconMax" style="max-width: 18px"/>
            <img v-else :src="iconMin" style="max-width: 18px"/>
          </div>
          <div class="icon c-cp" @click="handleClosed">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </div>
      <!--内容-->
      <div class="body c-fd_c" :style="contentStyle">
        <slot></slot>
      </div>
      <!--底部按钮-->
      <div class="footer" :height="footerHeight" v-if="$slots.footer" :style="footerStyle">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  import iconMax from './assets/max.png'
  import iconMin from './assets/min.png'
  import PopupManager from 'element-ui/lib/utils/popup/popup-manager'
  export default {
    name: 'WpWindow',
    components: { },
    props: {
      closed: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      headerStyle: {
        type: Object
      },
      contentStyle: {
        type: Object
      },
      footerStyle: {
        type: Object
      },
      width: {
        type: [String, Number],
        default: '400px'
      },
      height: {
        type: [String, Number],
        default: '95%'
      },
      headerHeight: {
        type: String,
        default: '38px'
      },
      footerHeight: {
        type: String,
        default: '20px'
      },
      // 关闭前回调,return为Boolean
      beforeClose: {
        type: Function
      },
      loading: {
        type: Boolean,
        default: false
      },
      zIndex: {
        type: [String, Number],
        default: () => {
          return PopupManager.nextZIndex()
        }
      },
      loadingText: {
        type: String,
        default: '加载中'
      },
      /**
       *位置
       */
      position: {
        type: Object,
        default () {
          return {
            right: '1%',
            top: '1%'
          }
        }
      },
      // 暂时设置
      drag: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        max: false,
        iconMax: iconMax,
        iconMin: iconMin,
        maxWidth: window.innerWidth,
        maxHeight: window.innerHeight
      }
    },
    computed: {
      color () {
        const theme = this.$store.state.theme
        return theme && theme.color
      },
      hasHeader () {
        return this.title !== null
      },
      mainClass () {
        return {
          'is-max': this.max
        }
      },
      style () {
        let mainStyle = {
          width: this.width,
          height: this.height
        }
        if (this.position) {
          return Object.assign(mainStyle, this.position)
        } else {
          return mainStyle
        }
      },
      winStyle () {
        return {
          zIndex: this.zIndex,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }
      }
    },
    created () {
      // console.log(this, 'this')
    },
    mounted () {
      // console.log(this, 'moundted')
      // this.$el.style.zIndex = PopupManager.nextZIndex()
      document.body.appendChild(this.$el)
    },
    methods: {
      // 拥有标题时固定窗口位置，没有标题时定位为鼠标右键悬浮框
      headDrag (msg, e) {
        if (this.max) {
          return
        }
        let dom = this.$refs.window
        let top = parseInt(dom.style.top.slice(0, -2)) - e.y
        dom.style.left = parseInt(dom.style.left.slice(0, -2)) + e.x + 'px'
        if (top > 0) {
          dom.style.top = top + 'px'
        }
      },

      handleClosed () {
        if (this.beforeClose && this.beforeClose() === false) {
          return
        }
        this.$emit('update:closed', true)
        this.$emit('on-closed')
      },
      changeSize () {
        this.max = !this.max
      },
    },
    beforeDestroy () {
    },
    destroyed () {
      // 热更新 或路由改变时弹窗未关闭
      const node = this.$el
      if (node && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }

  }
</script>
<style scoped lang="scss">
  .window:after{
    content: "";
    height: 0;
    clear: both;
    overflow: hidden;
    display: block;
    visibility: hidden;
  }
  .main {
    position: fixed;
    border-radius: 4px;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
    transition: width .3s,height .3s,top .3s,left .3s;
    z-index: 99
  }

  .header {
    font-size: 1.8rem;
    display: flex;
    color: $base-color;
    opacity: $base-opacity;
    padding: 10px;
    align-items: center;
  }

  .tools {
    position: relative;
  }

  .icon {
    width: 18px;
    margin: 0 0 0 5px;
    cursor: pointer;
  }
  .icon:hover i{
    transform: rotateZ(360deg);
  }

  .body {
    flex: 1;
    overflow: hidden;
    padding: 10px;
  }

  .footer {
    text-align: right;
    margin: 0 5px;
    padding: 5px;
    /*background: #F5F8FA;*/
    /*box-shadow: inset 0 1px 0 0 #E9EFF3;*/
  }

  .footer .el-button {
    /*    border: 1px solid $colorPrimary;
        background: #fff;
        color: #71a9da;*/
  }

  .main .is-max {
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    transform: none;
  }
</style>
