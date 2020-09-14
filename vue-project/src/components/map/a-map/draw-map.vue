<template>
  <div class="a-map">
    <!--地图模式选择  设置-->
    <el-popover v-if="showSetting" placement="bottom" trigger="click" @hide="hideSelect">
      <div>
        <div class="title">地图设置</div>
        <div class="item">
          <span class="text"> 模式</span>
          <el-checkbox :value="!is3DShow" @change="changeViewModel(false)">平面</el-checkbox>
          <el-checkbox :value="is3DShow" @change="changeViewModel(true)">三维</el-checkbox>
        </div>
        <div class="item" v-if="true">
          <span class="text"> 图层</span>
          <el-checkbox v-for="layer in layers"
                       :label="layer.value"
                       :key="layer.value"
                       v-model="layer.show"
                       @change="setLayer(layer)">
            {{layer.name}}
          </el-checkbox>
        </div>
        <div class="item">
          <span class="text"> 要素</span>
          <el-checkbox v-for="feature in features"
                       :label="feature.value"
                       :key="feature.value"
                       v-model="feature.show"
                       @change="setFeatures">
            {{feature.name}}
          </el-checkbox>
        </div>
        <div class="item">
          <span class="text">主题</span>
          <el-select v-model="style" size="small" placeholder="样式选择" ref="select">
            <el-option
              v-for="item in styleList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div slot="reference" class="tools">
        <i class="el-icon-setting s-c"></i>
      </div>
    </el-popover>

    <!--地图-->
    <div ref="map" style="height: 100%;"></div>

    <!--搜索工具-->
    <el-autocomplete
      class="search"
      v-model="place"
      :fetch-suggestions="search"
      placeholder="请输入搜索地址"
      :trigger-on-focus="false"
      @select="searchMap"
      @change="search"
    >
      <i
        class="el-icon-search"
        slot="prepend"
        @click="search">
      </i>
      <template slot-scope="{ item }">
        <div class="c-fd_c">
          <div class="searchResult">
            <i class="el-icon-location-information">
              {{ item.name }}
            </i>
          </div>
          <div class="address">
            {{item.pname}}{{item.cityname}}{{item.adname}}{{item.address}}
          </div>
        </div>
      </template>
    </el-autocomplete>

    <!--绘画工具-->
    <div class="drawTool">
      <div class="c-fd_sb">
        <el-radio-group v-model="type" @change="draw"  size="small">
          <el-radio-button label="marker">点</el-radio-button>
          <el-radio-button label="polyline">线</el-radio-button>
          <el-radio-button label="polygon">面</el-radio-button>
          <el-radio-button label="rectangle">长方形</el-radio-button>
          <el-radio-button label="circle">圆</el-radio-button>
        </el-radio-group>
        <el-button-group class="operate">
          <el-button  @click="clear" size="mini" style="height: 32px">清除</el-button>
          <el-button  @click="clearAll" size="mini" style="height: 32px">清空</el-button>
        </el-button-group>
      </div>
    </div>

    <!--坐标-->
    <div class="mtable" v-if="showTable">
      <div class="mtable-header">界址点坐标表</div>
      <el-table
        class="area-table"
        :data="initData[0].points"
        border
        :max-height="maxHeight"
        style="width: 100%">
        <el-table-column
          prop="lng"
          align="center"
          label="X">
        </el-table-column>
        <el-table-column
          prop="lat"
          align="center"
          label="Y">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import {MAP_CENTER} from 'src/config/index.js'
let aMaploader = null

function getAMap () {
  if (!window.AMap) {
    window.AMap = {}
    const version = '1.4.15'
    const key = '608d75903d29ad471362f8c58c550daf' // 此key为开发者文档地图示例所使用的KEY，卫星图的精度更高
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=${version}&key=${key}&callback=__initAMap__&plugin=AMap.Autocomplete,AMap.PlaceSearch`
    document.body.appendChild(script)
    aMaploader = new Promise((resolve) => {
      window.__initAMap__ = function () {
        resolve(window.AMap)
        window.document.body.removeChild(script)
        aMaploader = null
        delete window.__initAMap__
      }
    })
    return aMaploader
  }
  if (aMaploader) {
    return aMaploader
  }
  return Promise.resolve(window.AMap)
}

export default {
  props: {
    showSetting: {
      type: Boolean,
      default: true
    },
    // 高德地图初始化配置选项
    options: {
      default () {
        return {}
      }
    },
    // 画线颜色 fillColor和strokeColor两个字段
    defaultStyle: {
      type: Object,
      default () {
        return {
          fillColor: '#ff1a58',
          strokeColor: '#f59f99'
        }
      }
    },
    // 绘制地图的数据type，样式和经纬度，
    initData: {
      type: Array,
      default: () => [
        {
          type: null,
          fillColor: null,
          strokeColor: null,
          points: []
        }
      ]
    },
    showTable: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number,
      default: 200
    },
  },
  data () {
    return {
      // 地图是否加载完成
      isLoaded: false,
      is3DShow: false,
      styleList: [
        {
          name: '标准',
          value: 'normal'
        }, {
          name: '幻影黑',
          value: 'dark'
        }, {
          name: '月光银',
          value: 'light'
        }, {
          name: '远山黛',
          value: 'whitesmoke'
        }, {
          name: '草色青',
          value: 'fresh'
        }, {
          name: '雅士灰',
          value: 'grey'
        }, {
          name: '涂鸦',
          value: 'graffiti'
        }, {
          name: '马卡龙',
          value: 'macaron'
        }, {
          name: '靛青蓝',
          value: 'blue'
        }, {
          name: '极夜蓝',
          value: 'darkblue'
        }, {
          name: '酱籽',
          value: 'wine'
        }
      ],
      style: 'normal',
      features: [
        {
          name: '区域面',
          value: 'bg',
          show: true
        }, {
          name: '道路',
          value: 'road',
          show: true
        }, {
          name: '建筑物',
          show: true,
          value: 'building'
        }, {
          name: '标注',
          show: false,
          value: 'point'
        }],
      layers: [
        {
          name: '卫星',
          value: 'Satellite',
          show: false
        }, {
          name: '路网',
          value: 'RoadNet',
          show: false
        }, {
          name: '实时路况',
          value: 'Traffic',
          show: false
        }
      ],
      searchValue: null,
      searcList: [],
      type: null,
      axis: [],
      mapData: [],
      polyline: {},
      polygon: {},
      placeSearch: {},
      marker: {},
      place: null,
      searchResult: []
    }
  },
  components: {
  },
  watch: {
    style(val) {
      this.setMapStyle(val)
    },
    initData(val) {
      getAMap().then(this.initMap)
      this.mapData = JSON.parse(JSON.stringify(val))
    }
  },
  mounted () {
    const options = this.options
    if (options.mapStyle) {
      this.style = this.options.mapStyle.split('/')[3]
    }
    if (options.features) {
      this.features.forEach(item => {
        item.show = options.features.indexOf(item.value) !== -1
      })
    }
    getAMap().then(this.initMap)
  },
  computed: {
  },
  methods: {
    initMap (options = {}) {
      var that = this
      this.destroyMap()
      const map = new AMap.Map(this.$refs.map, {
        center: MAP_CENTER || '中国',
        resizeEnable: true,
        mapStyle: 'amap://styles/normal',
        zoom: 13,
        ...this.options,
        ...options
      })
      map.on('complete', () => {
        this.isLoaded = true
        this.$emit('map-ready', map)
      })
      this.$_map = map
      var mouseTool
      map.plugin(['AMap.MouseTool','AMap.PolyEditor'],function() {
        mouseTool = new AMap.MouseTool(map);
      })

      //监听draw事件(双击结束编辑)可获取画好的覆盖物
      var that = this
      mouseTool.on('draw',function(e){
        if (that.type == 'marker') {
          console.log(e.obj.w.position)
          that.axis = [e.obj.w.position]
          that.dealMapData()
        } else {
          console.log(e.obj.getPath(),555555555555)
          that.axis = e.obj.getPath()
          that.dealMapData()
        }
      })
      this.mouseTool = mouseTool

      //如果是编辑则渲染画面
      if(this.initData.length > 0) {
        this.editMap()
      }

    },
    // 提交数据
    dealMapData () {
      this.mapData.push(
        {
          type: this.type,
          fillColor: this.defaultStyle.fillColor,
          strokeColor: this.defaultStyle.strokeColor,
          points: []
        }
      )
      this.mapData[this.mapData.length - 1]['points'] = this.axis.map(item => {
        return {
          lng: item.lng,
          lat: item.lat
        }
      })
      this.$emit('refreshMapData',this.mapData)
    },
    getMap () {
      return this.$_map
    },
    setMapStyle (name) {
      if (!this.isLoaded) return
      const styleName = 'amap://styles/' + name
      this.$_map.setMapStyle(styleName)
    },
    setFeatures () {
      const features = this.features.filter(item => item.show).map(item => item.value)
      this.$_map.setFeatures(features)
    },
    setLayer (layer) {
      if (!layer.layer) {
        layer.layer = new AMap.TileLayer[layer.value]()
      }
      const fn = layer.show ? this.$_map.add : this.$_map.remove
      fn.call(this.$_map, layer.layer)
    },
    // 是否3d显示
    changeViewModel (is3d) {
      if (this.is3DShow === is3d) {
        return
      }
      this.is3DShow = is3d
      const map = this.$_map
      const options = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        // 开启3D视图,默认为关闭
        viewMode: is3d ? '3D' : false,
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        resizeEnable: true,
        rotateEnable: true,
        pitchEnable: true,
        buildingAnimation: true// 楼块出现是否带动画
      }
      this.initMap(options)
    },
    destroyMap () {
      this.$_map && this.$_map.destroy()
    },
    hideSelect () {
      this.$refs.select.blur()
    },

    // 开始绘画
    draw(){
      switch(this.type){
        case 'marker':{
          this.mouseTool.marker({
            //同Marker的Option设置
          });
          break;
        }
        case 'polyline':{
          this.mouseTool.polyline({
            borderWeight: 0.5, // 线条宽度
            strokeColor: this.defaultStyle.fillColor,
            strokeWeight: 2,
            strokeOpacity: 0.5
          });
          break;
        }
        case 'polygon':{
          this.mouseTool.polygon({
            fillColor: this.defaultStyle.fillColor,
            strokeColor: this.defaultStyle.strokeColor,
          });
          break;
        }
        case 'rectangle':{
          this.mouseTool.rectangle({
            fillColor: this.defaultStyle.fillColor,
            strokeColor: this.defaultStyle.strokeColor
          });
          break;
        }
        case 'circle':{
          this.mouseTool.circle({
            fillColor: this.defaultStyle.fillColor,
            strokeColor: this.defaultStyle.strokeColor,
            //同Circle的Option设置
          });
          break;
        }
      }
    },

    // 编辑绘画
    editMap () {
     for (let item of this.initData) {
       this.type = item.type
       this.axis = JSON.parse(JSON.stringify(item.points))
       let path = []
       path = this.axis.map(item => {
         return [item.lng, item.lat]
       })
       console.log(path)
       switch (this.type) {
         case 'marker':
           break
         case 'polyline':
           this.polyline = new AMap.Polyline({
             path: path,
             strokeColor: this.defaultStyle.strokeColor,
             lineJoin: 'round',
             strokeWeight: 2,
             strokeOpacity: 0.5,
           })
           this.$_map.add(this.polyline)
           this.axis = path
           break
         case 'polygon':
           this.polygon = new AMap.Polygon({
             path: path,
             fillColor: this.defaultStyle.fillColor,
             strokeColor: this.defaultStyle.strokeColor,
             zIndex: 51,
             strokeOpacity: 0.3,
             fillOpacity: 0.3
           })
           this.$_map.add(this.polygon)
           this.axis = path
           break
         case 'rectangle':
           break
         case 'circle':
           break
       }
     }
     this.$_map.setFitView()
    },


    edit() {
      var polyEditor = new AMap.PolyEditor(this.$_map, this.polyline)
      polyEditor.open()
    },

    search(place, cb) {
      this.$_map.remove(this.$_map.getAllOverlays('marker'))
      const key = 'd7e5ff192c959a63e629c5c9266ec0f2'
      //输入提示
      var autoOptions = {
        input: "tipinput"
      };
      var auto = new AMap.Autocomplete(autoOptions);
      console.log(auto)
      Axios.get(`https://restapi.amap.com/v3/place/text`,{
        params: {
          key: key,
          keywords: place,
        },
        headers: { 'Content-Type': 'application/json,charset=utf-8'},
      }).then((res) => {
        this.searchResult = res.data['pois']|| []
        cb(this.searchResult)
      })
    },

    searchMap(data) {
      let path = data.location.split(',')
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(Number(path[0]),Number(path[1]))
      })
      this.$_map.add(this.marker)
      this.$_map.setFitView()
    },

    // 清楚对应类型
    clear() {
      this.$_map.remove(this.$_map.getAllOverlays(this.type))
      this.axis = []
      this.clearMapData()
      this.draw()
    },

    // 清空画布
    clearAll() {
      this.$_map.clearMap();
      this.axis = []
      this.mapData = []
      this.$emit('refreshMapData',this.mapData)
      this.draw()
    },

    clearMapData() {
      for (let i= this.mapData.length-1; i>=0; i--) {
        let item = this.mapData[i]
        if (item.type === this.type) {
          this.mapData.splice(i,1)
        }
      }
      this.$emit('refreshMapData',this.mapData)
    }
  },
  beforeDestory () {
    this.destroyMap()
  }
}
</script>
<style scoped lang="scss">
  .a-map {
    height: 100%;
    position: relative;
  }

  .tools {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 2rem;
    cursor: pointer;
  }

  .title {
    font-size: 1.8rem;
    margin: 5px 0;
  }

  .item {
    margin: 0 0 10px 0;
  }

  .text {
    margin-right: 5px;
    font-size: 1.2rem;
    letter-spacing: 0.5em;
    display: inline-block;
    width: 3.5em;
  }

  /*画图样式*/
  .drawTool {
    position: absolute;
    bottom:0px;
    left:0px;
    height: auto;
    z-index: 1000;
  }

  /*搜索样式*/
  .search {
    position: absolute;
    top:0px;
    left:0px;
    width: 300px;
    height: auto;
    z-index: 1000;
  }
  

  .searchResult {
    /*line-height: normal;*/
  }

  .address{
    font-size: smaller;
    line-height: normal;
    color: #8c939d;
  }

  /*坐标样式*/
  .mtable{
    position: absolute;
    bottom:10px;
    right:10px;
    width: 30%;
    padding: 5px;
    height: auto;
    background: #fff;
  }
  .mtable-header{
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 1.4rem;
  }
  .area-table.el-table td, .area-table.el-table th{
    padding: 4px 0;
    .cell{
      padding: 0;
      margin: 0;
    }
  }
  @media screen and (min-width:1367px) {
    .area-table.el-table td, .area-table.el-table th{
      padding: 8px 0;
      .cell{
        padding: 0;
        margin: 0;
      }
    }
  }
</style>
<style>
  /*高德地图标识 建议保留 目前在非标准主题下会自动隐藏*/
   .amap-logo, .amap-copyright {
      display: none !important;
    }
</style>
