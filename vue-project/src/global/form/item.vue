<template>
  <div class="c-form-item" :class="{
    'is-required':required,
    'is-error':status === 'error',
    'is-success':status === 'success' && pageStatus !== 'view',
    'is-warn':status === 'warn'
    }">
    <label class="c-form-label" :style="{width:labelWidth}" v-if="!hiddenLabel">{{label}}</label>
    <div class="c-form-item__content" :title="title">
      <slot></slot>
      <div style="position: absolute;z-index: 10" v-if="status === 'error'">
        <div class="arrow"></div>
        <div class="warn">
          {{title}}
        </div>
      </div>
    </div>
    <el-popover placement="top" v-if="showTip" trigger="click">
      <div v-html="tipContent"></div>
      <i class="el-icon-question c-cp" style="color:#E6A23C" slot="reference"></i>
    </el-popover>

  </div>
</template>
<script>
  export default {
    props: {
      pageStatus: String,
      label: String,
      labelWidth: String,
      hiddenLabel: { default: false },
      required: {
        type: Boolean,
        default: false
      },
      // 表单验证
      vtype: {
        type: Function,
        default: function () {
          return { status: true, msg: null }
        }
      },
      // 输入框对应的值
      value: {
        required: true
      },
      tip: {
        type: String
      }
    },
    data () {
      return {
        title: null,
        status: null,
        initialValue: []
      }
    },
    computed: {
      showTip () {
        return this.tip && this.tip.indexOf('<script>') === -1 && this.tip.indexOf('javascript:') === -1
      },
      tipContent () {
        return this.tip.split('\n').join('<br/>')
      }
    },
    watch: {
      value: {
        immediate: false,
        handler (val, oldval) {
          if (!this.$_notFirst) {
            this.$_notFirst = true
            return
          }
          this.validate()
        }
      }
    },
    mounted () {
      this.$emit('item-change', this)
      let initialValue = this.value
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue)
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      })
    },
    beforeDestroy () {
      this.$emit('item-change', this, true)
      this.$_notFirst = null
    },
    methods: {
      /*
      *验证值是否合法
      */
      validate () {
        let val = this.value
        // 多选select 默认值为 数组
        if (this.required && (val === '' || val === null || (Array.isArray(val) && val.length === 0))) {
          this.status = 'error'
          this.title = '此项不允许为空'
          return false
        }
        let msg = this.vtype(val)
        // console.log(this.vtype)
        if (msg.status) {
          this.status = 'success'
          this.title = null
          return true
        }
        this.status = 'error'
        this.title = msg.msg
      },
      reset () {
        this.$_notFirst = false
        this.status = null
      }
    }
  }
</script>
<style scoped lang="scss">
  .arrow {
    display: block;
    margin-left: 5px;
    /*@include triangle('bottom', #FFDFDF, 3px)*/
  }

  .warn {
    opacity: 0.9;
    background: #FFDFDF;
    border-radius: 2px;
    padding: 1px 3px;
    z-index: 1;
    font-size: 1.2rem;
  }
</style>
<style lang="scss">
  .c-form-item {
    display: flex;
    margin-bottom: 10px;
    text-align: left;

    .el-input__inner {
      min-height: 35px;
      height: 1.5em;
    }
  }

  .c-form-label {
    font-size: 1.3rem;
    color: #495E6F;
    font-weight: 600;
    /* 视觉对齐*/
    margin-top: 2px;
  }
  .c-form-item__content {
    position: relative;
    flex: 1;
  }

  .c-form-item.is-error {
    color: red;
  }

  .c-form-item.is-success {
    color: green;
  }

  .c-form-item.is-required > .c-form-label:before {
    content: "*";
    color: #f56c6c;
    display: inline-block;
    width: 8px;
    margin-left: -8px;
  }

  .c-form-view {
    .c-form-item.is-required > .c-form-label:before {
      content: "";
    }
  }
  @media print {
    .c-form-label{
      color: #44BB35 !important;
    }
  }
</style>
