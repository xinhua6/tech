<script type="text/jsx">
  import Item from './item'

  const DEFAULT_CONFIG = {
    margin: 0,
    padding: 0,
    labelWidth: '80px',
    width: '45%'
  }
  export default {
    // functional: true,
    name: 'WpForm',
    components: { Item },
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
    created () {
      this.$_FormItems = []
    },
    computed: {
      formConfig () {
        return Object.assign(DEFAULT_CONFIG, this.defaultConfig)
      },
      formDisabled () {
        return this.disabled || this.isView
      }
    },
    watch: {
      data (val) {
        this.$_cloneData = JSON.parse(JSON.stringify(val))
      },
      items: {
        immediate: true,
        handler (items) {
          const rows = [[]]
          let index = 0
          const defaultwidth = parseFloat(this.formConfig.width)
          items.reduce((prev, cur, i, arr) => {
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
          this.$_rows = rows
          // console.log(rows,'rows')
        }
      }
    },
    render (h, context) {
      const className = {
        'c-form': true,
        'c-form-view': this.isView,
        'c-form-disabled': this.formDisabled,
        'c-form-top': this.labelPosition === 'top',
        'c-form-left': this.labelPosition === 'left'
      }
      return (<form className={className}>
                {
                  this.isView ? this.renderRow(h) : this.createdChild(h)
                }
              </form>)
    },
    beforeDestroy () {
      this.$_cloneData = this.$_FormItems = null
    },
    methods: {
      // 是否通过验证
      isValid () {
        return this.$_FormItems.every((item) => {
          return item.validate()
        })
      },
      // 重置表单
      reset () {},
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
      addFormItem (item) {
        this.$_FormItems.push(item)
      },
      renderRow (h) {
        return this.$_rows.map(row => {
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
          return this.$slots[item.name]
        }
        let data = this.data
        let key = item.name
        if (typeof data[key] === 'undefined') {
          this.$set(data, key, null)
        }
        return h('item', {
          key: item.label + item.name,
          attrs: {
            label: item.label,
            labelWidth: item.labelWidth || this.formConfig.labelWidth,
            value: data[key],
            vtype: item.vtype,
            required: !!item.required
          },
          on: {
            addFormItem: this.addFormItem
          },
          style: {
            width: width || item.width || this.formConfig.width
          }
        }, [this.renderFormItem(h, item)])
      },
      renderFormItem (h, item) {
        let data = this.data
        let key = item.name
        if (item.hidden) {
          return false
        }
        if (item.type === 'custom') {
          return this.$slots[item.name]
        }
        item.props = item.props ? item.props : {}
        if (this.formDisabled) {
          item.props.disabled = true
        }
        item.props.value = data[key]
        item.on = item.on ? item.on : {}
        if (item.type === 'el-select') {
          return h(item.type, this.createBaseVNodeData(item, data, key), item.options.map((option) => {
            return h('el-option', {
              key: option.key || option.label,
              attrs: {
                label: option.label,
                value: option.value
              }
            })
          }))
        }
        return h(item.type, this.createBaseVNodeData(item, data, key))
      },
      createBaseVNodeData (item, data, key) {
        return {
          attrs: item.props,
          props: item.props,
          style: {
            width: '100%'
          },
          // key: item.key || item.props.label,
          key: item.label + item.name,
          on: {
            input: (event) => {
              console.log(event)
            },
            ...item.on
          },
          // model: {
          //   value: this.data[key],
          //   callback: (val) => {
          //     this.data[key] = val
          //   },
          //   expression: 'data.' + key
          // },
          domProps: {
            value: data[key]
          }
        }
      }
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
    }

    .c-form-item {
        margin-bottom: 10px;
        text-align: left;

        .el-input__inner {
            height: 35px;
        }
    }

    .c-form-label {
        width: 80px;
        float: left;
        /*font-size: 12px;*/
        /*line-height: 36px;*/
        /*vertical-align: middle;*/
        font-size: 13px;
        color: #495E6F;
        font-weight: 600;
        line-height: 28px;
    }

    .c-form-item__content {
        position: relative;
        margin-left: 80px;
    }

    .c-form-item:after, .c-form-item:before {
        display: table;
        content: "";
    }

    .c-form-top {
        .c-form-label {
            float: none;
        }

        .c-form-item__content {
            margin-left: 0 !important;
        }
    }

    .c-form-left {
        .c-form-label {
            float: left;
        }

        .c-form-item__content {
            margin-left: 80px !important;
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
            display: flex;
            align-items: center;
        }

        .c-form-item__content {
            margin-left: 0 !important;
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
