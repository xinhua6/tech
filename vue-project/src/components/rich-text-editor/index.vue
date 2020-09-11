<template>
  <div class="editor">
    <div :id="editorId"></div>
  </div>
</template>

<script>
  import { guid } from 'src/utils/util'
  import WangEditor from 'wangeditor'
  export default {
    name: "index",
    data() {
      return {
        editor: null,
        editorId:''
      }
    },
    computed: {},
    watch: {},
    created() {
      this.initEditor()
      this.setConfig()
    },
    mounted() {

    },
    methods: {
      //初始化编辑器
      initEditor(){
        let _this = this;
        _this.editorId = guid();//生成一个id
        this.$nextTick(()=>{
          let editor = new wangEditor('#'+_this.editorId);
          _this.editor = editor;//将实例保存待调用其他api
          editor.create();//开始创建编辑器；
        })
      },
      setConfig(){
        let setting = {
          uploadImgShowBase64:true,// 是否允许上传base64位图片
          pasteFilterStyle:true, // 是否过滤粘贴的样式
          zIndex:100,//设置层叠位置
          //菜单列表
          menus:[
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 恢复
          ],
          showLinkImg:false,//是否显示“网络图片”tab
          //监听用户输入后的change事件
          onchange:function(html){
            console.log(html);
          }
        }
        //配置给编辑器
        this.editor.customConfig = Object.assign(this.editor.customConfig,setting)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>