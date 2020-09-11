<template>
  <div class="handsontable-vue"></div>
</template>

<script>
  // 文档地址 https://handsontable.com/docs/6.2.2/tutorial-introduction.html 6.2.2往上的版本商用付费
  import Handsontable from 'handsontable'
  import 'handsontable/languages/zh-CN'
  export default {
    name: 'handsontable6.2.2',
    props: {
      options: {
        type: Object,
        require: true
      }
    },
    mounted () {
      this.initTable()
    },
    methods: {
      initTable () {
        const { clientWidth, clientHeight } = this.$el
        // console.log(clientWidth, clientHeight)
        this.$_table = new Handsontable(this.$el, {
          width: clientWidth,
          height: clientHeight,
          language: 'zh-CN',
          ...this.options
        })
        console.log(this.$_table, 'handtable实例')
        this.$emit('ready', this.$_table)
      }
    },
    beforeDestroy () {
      this.$_table.destroy()
    }
  }
</script>

<style scoped src="handsontable/dist/handsontable.full.css">
</style>
