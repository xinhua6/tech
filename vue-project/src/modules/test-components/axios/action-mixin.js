export default {
  data() {
    return {
      currentPage: null,
      ajaxData: {
        page: 1,
        limit: 10
      },
      baseUrl: '',
      primaryKey: 'kid',

    }
  },
  methods: {
    /**
     *  分页
     * @param pageMsg {Obejct} {page:1,limit:15,refresh:false}
     */
    pageChange (pageMsg) {
      this.ajaxData.page = pageMsg.page
      this.currentPage = pageMsg.page
      // 如果点击分页或者刷新
      if (pageMsg.limit || pageMsg.refresh) {
        this.ajaxData.limit = pageMsg.limit || this.ajaxData.limit
        this.ajaxData.page = 1
        this.currentPage = 1
      }
      this.getData()
    },

    /*删除*/
    deleteOne(pageKid) {
      let params = {}
      params[this.primaryKey] = pageKid
      this.$axios({
        method: 'get',
        url: this.baseUrl + '_delete_one',
        params: params,
        loadingVm:this
      }).then((res) => {
        this.getData()
      })
    },
  }
}