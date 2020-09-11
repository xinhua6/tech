<template>
  <div class="c-fd_r c-h100">
    <div class="c-fd_c">
      <search-input :size="mini" v-model="ajaxData.keyword"  @search="getData" placeholder="请输入关键字搜索"/>
      <el-menu router :default-active="$route.path" class="c-flex_1 c-os" >
        <component class="menu-item" v-for="(value) in navList" :key="value.title+value.url"
                   :index="value.url" :is="(value.children&&value.children.length>0)?'el-submenu':'el-menu-item'">
          <template slot="title">
            <span>{{value.title}}</span>
          </template>
          <template v-if="value.children&&value.children.length>0">
            <el-menu-item class="menu-item" v-for="(v,i) in value.children" :key="v.url+i" :index="v.url">
              <span slot="title">{{v.title}}</span>
            </el-menu-item>
          </template>
        </component>
      </el-menu>
    </div>
    <div class="contain c-flex1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import searchInput from 'src/components/view/search-input.vue'
  export default {
    name: 'home',
    data () {
      return {
        navList: [
          {
            title: '地图',
            url: '/map',
            children: [
              {
                title: '高德地图',
                url: '/map/a-map'
              },
              {
                title: '百度地图',
                url: '/map/baidu-map'
              }
            ]
          },
          {
            title: '表格',
            url: '/table',
            children: [
              {
                title: '表格一',
                url: '/table/table01'
              },
              {
                title: '表格二',
                url: '/table/table02'
              },
              {
                title: '表格三',
                url: '/table/table03'
              }
            ]
          },
          {
            title: '文件上传',
            url: '/file',
            children: [
              {
                title: '本地文件上传',
                url: '/file/file01'
              },
              {
                title: '本地与在线文件上传',
                url: '/file/file02'
              },
              {
                title: '大文件上传',
                url: '/file/file03'
              }
            ]
          },
          {
            title: '在线excel表格',
            url: '/excel',
            children: [
              {
                title: '在线表格一',
                url: '/excel/excel01'
              },
              {
                title: '在线表格二',
                url: '/excel/excel02'
              }
            ]
          },
          {
            title: '请求',
            url: '/xhr',
            children:[
              {
                title: 'axios请求',
                url: '/xhr/axios'
              },
              {
                title: '封装vue中增删改查',
                url: '/xhr/axios02'
              }
            ]
          },
          {
            title: '图标',
            url: '/icon',
          },
          {
            title: '流程图',
            url: '/flowChart',
          },
          {
            title: '文件目录',
            url: '/menu'
          },
          {
            title: '菜单的动态配置',
            url: '/router'
          },
          {
            title: '埋点',
            url: '/router'
          },
          {
            title: '换皮肤',
            url: '/router'
          },
          {
            title: '动态',
            url: '/router'
          },
        ],
        ajaxData: {
          keyword: null
        }
      }
    },
    components: {
      searchInput
    },
    computed: {},
    watch: {},
    created () {

    },
    mounted () {
    },
    methods: {
      getData() {

      }
    }
  }
</script>

<style scoped>
.contain {
  position: relative;
  padding: 10px;
}
</style>
