export default {
  props: {
    treeProps: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      treeData: {},
      translateY: 0
    }
  },
  computed: {
    treeConfig () {
      return Object.assign({
        isTreeGrid: false,
        key: 'kid',
        childKey: 'children'
      }, this.treeProps)
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (data) {
        const treeData = Object.create(null)
        if (this.treeConfig.isTreeGrid) {
          const key = this.treeConfig.key
          data.forEach(row => {
            treeData[row[key]] = { expand: true }
          })
        }
        this.treeData = treeData
      }
    }
  },
  methods: {
    updateExpand (row) {
      const key = this.treeConfig.key
      const treeRow = this.treeData[row[key]]
      treeRow.expand = !treeRow.expand
      this.$emit('tree-expand-change', row, treeRow.expand)
    }
  }
}
