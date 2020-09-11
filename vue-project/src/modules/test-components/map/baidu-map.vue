<template>
  <div class="main">
    <bai-map ref="map" :mapStyle="mapStyle" :zoom="18" @map-ready="setData" :options="{minZoom:10}" :center="[lnt,lat]" clearable></bai-map>
    <div class="search">
      <el-input placeholder="请输入地址" v-model="value" size="small"  @keyup.enter.native="search">
        <i slot="prepend" class="el-icon-search" @click="search"></i>
      </el-input>
    </div>
    <div class="up-map-div">
      <wp-table :columns="columns"
                :data="tableData"
                :pager="false"
                v-bind="$attrs"
                :total="total"
      >
      </wp-table>
    </div>
    <el-button class="c-w100 confirm" type="primary" v-on:click="confirm">确定</el-button>
  </div>
</template>

<script>
  import BaiMap from 'src/components/map/baidu-map'
  export default {
    name: 'baidu-map',
    components: {
      BaiMap
    },
    data () {
      return {
        value: null,
        mapStyle: {
          styleJson: [
            {
              'featureType': 'highway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'provincialway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'on'
              }
            }, {
              'featureType': 'provincialway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subwaylabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subwaylabel',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'vacationway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'universityway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'scenicspotsway',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'entertainmentlabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'entertainmentlabel',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'restaurantlabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'restaurantlabel',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'hotellabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'lifeservicelabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'lifeservicelabel',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'businesstowerlabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'businesstowerlabel',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'scenicspotslabel',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }]
        },
        columns: [
          {
            label:'序号',
            prop:'number',
            width:'50'
          },
          {
            label: '经度（E)',
            prop: 'lnt',
            width: '100',
            align: 'left'
          },
          {
            label: '纬度(N）',
            prop: 'lat',
            width: '100',
            align: 'left'
          }
        ],
        total: 0
      }
    },

    computed: {
      lnt () {
        if (this.tableData.length === 0) {
          return 113.384296
        } else {
          return this.tableData[0].lnt
        }
      },
      lat () {
        if (this.tableData.length === 0) {
          return 22.937619
        } else {
          return this.tableData[0].lat
        }
      }
    },

    props: {
      // 接收的经纬度数据
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },

    mounted () {
    },
    methods: {
      search () {
        const map = this.$refs.map.getMap()
        let that = this
        // map.clearOverlays()// 清空原来的标注
        const local = new BMap.LocalSearch(map, {
          renderOptions: { map: map }
        })
        local.enableAutoViewport() // 允许自动调节窗体大小
        local.setSearchCompleteCallback(function (searchResult) {
          let poi = searchResult.getPoi(0)
          map.addOverlay(new BMap.Marker(poi.point))
        })
        local.search(that.value)
      },

      confirm () {
        this.$emit('closeWin', false)
      },

      // 在地图上画闭环
      mapReady (map,arr) {
        let troods = []
        arr.forEach(item => {
          let point = new BMap.Point(item.lnt, item.lat)
          troods.push(point)
        })
        let polyline = new BMap.Polygon(troods)
        map.addOverlay(polyline)
      },

      // 对数据进行分组
      setData(map) {
        map.clearOverlays()
        let point = 0
        let that = this
        let fenzu = function (item) {
          let newarr = []
          let start = item || that.tableData[0]
          let end
          for (let i = point + 1; i < that.tableData.length; i++) {
            if (that.tableData[i].lnt === start.lnt && that.tableData[i].lat === start.lat) {
              end = that.tableData[i]
              newarr = that.tableData.slice(point, i + 1)
              that.mapReady(map, newarr)
              point = i + 1
              break
            }
          }
        }
        fenzu()
        if (point < this.tableData.length) {
          fenzu(this.tableData[point])
        }
      }

    }

  }
</script>

<style scoped>
  .search {
    position: absolute;
    z-index: 9999;
    top: 5px;
    left: 1px;
  }
  .main {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .up-map-div {
    top: 0px;
    width: 260px;
    height: 90%;
    bottom: 1%;
    right: 1%;
    text-align: center;
    display: inline-table;
    position: absolute;
    z-index: 9;
  }

  .up-map-div /deep/ .table {
    height: 480px;
  }

  .confirm {
    position: absolute;
    width: 260px;
    z-index: 9;
    right: 1%;
    bottom: 0px;
  }
</style>
