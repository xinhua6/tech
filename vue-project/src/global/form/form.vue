<script>
  import Vue from 'vue'
  import FormItem from './item'

  const DEFAULT_CONFIG = {
    margin: 0,
    padding: 0,
    labelWidth: '6em',
    itemWidth: '45%'
  }
  export default {
    // functional: true,
    name: 'WpForm',
    components: { FormItem },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      labelPosition: {
        type: String,
        default: 'left'
      },
      defaultConfig: {
        type: Object,
        default () {
          return {}
        }
      },
      items: {
        type: [Object, Array],
        required: true
      },
      data: {
        type: Object,
        required: true
      },
      isView: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        formItems: []
      }
    },
    created () {
      // this.formItems = []
    },
    computed: {
      formConfig () {
        return {
          ...DEFAULT_CONFIG,
          ...this.defaultConfig
        }
      },
      formDisabled () {
        return this.disabled || this.isView
      },
      rows () {
        const rows = [[]]
        let index = 0
        const defaultwidth = parseFloat(this.formConfig.itemWidth)
        this.items.filter(item => !item.hidden).reduce((prev, cur, i, arr) => {
          let initWidth = parseFloat(cur.width || defaultwidth)
          let width = prev + initWidth
          if (width > 100) {
            index++
            rows[index] = [arr[i]]
            width = initWidth
          } else {
            rows[index].push(arr[i])
          }
          return width
        }, 0)
        // this.$_rows = rows
        return rows
      }
    },
    watch: {
      data (val) {
        this.$_cloneData = JSON.parse(JSON.stringify(val))
      }
    },
    render (h, context) {
      const child = this.isView ? this.renderRow(h) : this.createdChild(h)
      return h('form', {
        staticClass: 'c-form',
        class: {
          'c-form-view': this.isView,
          'c-form-disabled': this.formDisabled,
          'c-form-top': this.labelPosition === 'top',
          'c-form-left': this.labelPosition === 'left'
        }
      }, child)
    },
    methods: {
      // 是否通过验证
      isValid () {
        return this.formItems.every((item) => {
          return item.validate()
        })
      },
      // 重置表单
      reset () {
        this.formItems.forEach(item => {
          item.reset()
        })
      },
      // 表单的值是否修改
      isChange () {
        return this.isFormChange(this.data, this.$_cloneData)
      },
      // 获取修改的值
      getChange () {
        let obj = {}
        let oval = this.$_cloneData
        let nval = this.data
        for (let key in oval) {
          if (oval[key] !== nval[key]) {
            obj[key] = nval[key]
          }
        }
        return obj
      },
      /**
       * 比对两个对象的值是否相等，不判断对象
       * @param nval
       * @param oval
       * @returns {boolean}
       */
      isFormChange (nval, oval) {
        // 只是比对form表单中的值
        for (let key in oval) {
          if (oval[key] !== nval[key] && (typeof oval[key] !== 'object' || oval[key] === null)) {
            if (oval[key] === null && nval[key] === '') {
              continue
            }
            return true
          }
        }
        return false
      },
      formItemChange (item, isDel) {
        if (isDel) {
          const index = this.formItems.indexOf(item)
          this.formItems.splice(index, 1)
          return
        }
        this.formItems.push(item)
      },
      renderRow (h) {
        return this.rows.map(row => {
          const width = row.length && (100 / row.length).toFixed(2) + '%'
          return h('div', {
              staticClass: 'c-form-row'
            }, row.map(col => this.renderItem(h, col, width))
          )
        })
      },
      createdChild (h) {
        const items = this.items
        const child = []
        if (items) {
          items.forEach((item) => {
            if (item.hidden) {
              return
            }
            child.push(this.renderItem(h, item))
          })
        }
        return child
      },
      renderItem (h, item, width) {
        /**
         *  占位
         * */
        if (item.type === 'hidden') {
          return h('div', {
            style: { width: item.width || 0 }
          })
        }
        /**
         * 自定义formitem组件,如需验证
         * */
        if (item.type === 'formItem') {
          if (process.env.NODE_ENV === 'development') {
            if (!this.$slots[item.name]) {
              console.error(`需要定义名为${item.name}的slot`)
              return h('div')
            }
          }
          return this.$slots[item.name]
        }
        let data = this.data
        let key = item.name
        if (typeof data[key] === 'undefined') {
          this.$set(data, key, null)
        }
        return h(FormItem, {
          props: {
            label: item.label,
            labelWidth: item.labelWidth || this.formConfig.labelWidth,
            value: data[key],
            vtype: item.vtype,
            required: !!item.required,
            hiddenLabel: item.hiddenLabel,
            tip: item.tip,
            showOverflowTooltip: item.showOverflowTooltip || false
          },
          class: item.class,
          key: item.name,
          on: {
            'item-change': this.formItemChange
          },
          style: {
            width: width || item.width || this.formConfig.itemWidth
          }
        }, [this.renderFormItem(h, item)])
      },
      renderFormItem (h, item) {
        const data = this.data
        const key = item.name
        if (item.hidden) return false
        if (item.type === 'custom') return this.$slots[item.name]
        // if (this.isView) {}
        if (item.type === 'el-select') {
          return h(item.type, this.createBaseVNodeData(item, data, key), item.options.map((option) => {
            return h('el-option', {
              key: option.key || option.label,
              attrs: {
                label: item.ydc ? option[item.ydc.label] : option.label,
                value: item.ydc ? option[item.ydc.value] : option.value
              }
            })
          }))
        }
        if ('showOverflowTooltip' in item && item.showOverflowTooltip) {
          return h('el-tooltip', {
            props: {content: data[key]}
            },[h(item.type, this.createBaseVNodeData(item, data, key))]
          )
        }
        return h(item.type, this.createBaseVNodeData(item, data, key))
      },
      createBaseVNodeData (item, data, key) {
        const props = item.props ? { ...item.props } : {}
        const listeners = item.on ? item.on : {}
        const attrs = item.attrs ? item.attrs : {}
        if (this.formDisabled) {
          props.placeholder = null
          props.disabled = true
          // 兼容两种配置
          attrs.placeholder = null
          attrs.disabled = true
        }
        props.value = data[key]
        return {
          // disabled ,placeholder 等原生支持属性 需在组件内的 props显式声明
          attrs: attrs,
          props: props,
          staticStyle: {
            width: '100%'
          },
          key: item.key || props.label,
          on: {
            input: (val) => {
              // 此处的input事件非原生input 事件
              this.data[key] = val
            },
            ...listeners
          }
        }
      },
    },
    destroyed () {
      this.$_cloneData = null
    }
  }

</script>
<style lang="scss">
    .c-form {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 10px;
        width: 100%;

        .is-disabled .el-input__inner {
            cursor: default !important;
        }
    }

    .c-form-row {
        width: 100%;
        display: flex;
        page-break-before: avoid;
        page-break-after: avoid;
    }

    .c-form-item:after, .c-form-item:before {
        display: table;
        content: "";
    }

    .c-form-top {
        .c-form-label {
            width: 100%;
        }
    }
</style>
<style lang="scss">
    $border-color: #E9EFF3;
    @mixin inputSytle {
        border: 0;
        color: #2E3B46;
        background-color: transparent;
    }

    .c-form-view {
        .c-form-label {
            margin: 0 0 0 10px;
        }

        // form item
        .c-form-item {
            border-left: 1px solid $border-color;
            margin: 0;
            padding: 5px;
            align-items: center;
        }

        .c-form-item__content {
            width: 100%;
        }

        .c-form-row {
            &:first-child {
                border-top: 1px solid $border-color;
            }

            border-bottom: 1px solid $border-color;

            .c-form-item:first-child {
                border-left: 0;
            }
        }

        // input
        .el-input.is-disabled .el-input__inner {
            @include inputSytle
        }

        .el-input--prefix .el-input__inner {
            padding: 15px;
        }

        // select
        .el-input__suffix {
            display: none;
        }

        .el-input__prefix {
            display: none;
        }

        // textarea
        .el-textarea.is-disabled .el-textarea__inner {
            @include inputSytle
        }
    }
</style>
