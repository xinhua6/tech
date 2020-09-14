<template>
    <el-select :value="value"
               :loading="loading"
               :disabled="disabled"
               :multiple="multiple"
               :size="size"
               @change="change"
               @input="inputChange">
        <el-option
                v-for="item in dataList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'wp-const-select',
    props: {
      /**
       *  {
       *      url:String,     /test-url
       *      labelKey:String,   label
       *      valueKey:String,    value
       *      severName:String,   HMS-DATA，
       *      data:Array, // 暂时未有后台配置的数据
       *  }
       */
      options: {
        type: Object,
        require: true
      },
      params: Object, // 请求附带参数
      value: {},
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * 附加选项 如 [{label:'全部',value:-1}]
       *
       */
      additionalData: {
        type: Array,
        default () {
          return []
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      size: {
        default: 'normal'
      }
    },
    data () {
      return {
        loading: false,
        constData: []
      }
    },
    computed: {
      dataList () {
        return this.additionalData.concat(this.constData)
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        if (Array.isArray(this.options.data)) {
          this.constData = [...this.options.data]
          return
        }
        const { url, labelKey, valueKey, severName } = this.options
        this.$axios({
          cache: true,
          loadingVm: this,
          params: this.params,
          url: `${severName}/${url}`
        }).then(res => {
          this.constData = res.data.map(item => {
            return {
              label: item[labelKey],
              value: item[valueKey]
            }
          })
          if (res.defaultValue) {
            this.inputChange((res.defaultValue))
            this.change((res.defaultValue))
          }
        })
      },
      change (val) {
        const select = this.multiple ? val : this.dataList.find(item => item.value === val)
        this.$emit('change', select, this.constData)
      },
      inputChange (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped>

</style>
