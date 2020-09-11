// 详细页面mixin
import { guid, merge } from 'src/utils/util'
import { formErrorWarn, windowCloseWarn } from 'src/utils/fn'

export default {
  data () {
    return {
      loading: false,
      ajaxData: {},
      // 基本请求url
      baseUrl: '',
      // 页面唯一kid
      pageKid: null,
      // 数据主键值
      primaryKey: 'kid',
      isGuid: true,
      // page存在'add'和'edit'两种状态
      page: 'add',
    }
  },
  computed: {
    actions () {
      return [
        {
          name: 'cancel',
          label: '取消',
          click: this.cancel
        },
        {
          name: 'save',
          label: '确认',
          type: 'primary',
          click: this.save
        }
      ]
    },
    // 用于判断是否在查看详情页面还是编辑增加窗口
    isView () {
      return this.page === 'view' || this.page === 'sign'
    }
  },
  props: {
    editData: {
      type: Object
    },
  },
  created () {
    console.log(this.page, 'page')
    this.initDetailPage()
  },
  methods: {
    initDetailPage () {
      this.beforeInitDetailPage && this.beforeInitDetailPage()
      if (this.page !== 'add') {
        this.pageKid =this.$route.query[this.primaryKey] || this.editData[this.primaryKey]
        this.getDetailData()
      } else {
        this.pageKid = this.isGuid ? guid() : null
      }
      this.ajaxData[this.primaryKey] = this.pageKid

      /**
       * 外嵌弹窗关闭回调
       */
      this.$emit('before-close', () => {
        this.close(false)
      })
    },

    /**
     * 获取详细页面的数据
     * @param kid 数据的kid 必传
     */
    getDetailData () {
      this.loading = true
      let params = {}
      params[this.primaryKey] = this.pageKid
      this.$axios({
        method: 'get',
        loadingVm: this,
        url: this.baseUrl + '_query_one',
        params: params
      }).then((res) => {
        if (res.success) {
          this.formData = res.data || {}
          this.aftergetDetailData && this.aftergetDetailData(res.data)
        } else {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 保存 新增 或编辑的数据 需要包含 ref=form
     *  包含 beforeSave 钩子 return true 则保存
     *  自定义 请求url customUrl
     */
    save (_page) {
      const page = _page || this.page
      // beforeSave 判断表单数据格式
      this.beforeSave && !this.beforeSave()
      if (!this.validateForm()) {
        return
      }
      const form = this.$refs.form
      let url =  this.baseUrl + '_' + page
      let change = page === 'edit' ? form.getChange() : this.formData
      merge(change, this.ajaxData)
      if (typeof this.addExtraParams === 'function') {
        const pramas = this.addExtraParams(change)
        if (process.env.NODE_ENV === 'development') {
          if (typeof params !== 'object') {
            console.error('this.addExtraParams需要返回所额外添加保存参数的对象')
          }
        }
        change = Object.assign(change, pramas)
      }
      this.loading = true
      this.$axios({
        method: 'post',
        url: url,
        data: change,
        loadingVm:this
      }).then((res) => {
        this.loading = false
        this.close(true)
        // 数据新增、修改后调用
        this.$emit('refresh', res.data)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.afterSave && !this.afterSave()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 表单验证,可在beforeSave 里面自定义验证
     * @returns {boolean}
     */
    validateForm () {
      const form = this.$refs.form
      if (!form.isValid()) {
        formErrorWarn()
        return false
      }
      return !(this.beforeSave && !this.beforeSave())
    },
    /**
     * 取消
     */
    cancel () {
      this.close(false)
    },
    /**
     * 关闭弹窗,或返回页面
     * @param isSaved 是否已经保存
     */
    close (isSaved) {
      if (this.page === 'view') {
        this.$router.back()
        return
      }
      const form = this.$refs.form
      isSaved = (typeof isSaved === 'boolean' && isSaved)
      if (form && this.page !== 'view' && !isSaved && form.isChange()) {
        windowCloseWarn(() => {
          this.$emit('close', false)
          this.$emit('update:detailShow', false)
        })
        return
      }
      this.$emit('update:detailShow', false)
      this.$emit('close', isSaved)
      if (isSaved) {
        this.$router.push({
          query: {
            update: true
          }
        })
      }
    },
    /**
     * 获取formItem
     * @param
     */
    findItemFormName (name, data) {
      return data.find((item) => {
        return item.name === name
      })
    },

  }
}
