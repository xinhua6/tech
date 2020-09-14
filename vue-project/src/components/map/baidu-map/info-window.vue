<template>
    <div class="info" v-show="show">
    <div class="title">
        <span>{{blockMsg.blockName}}</span>
        <i class="el-icon-close c-fr c-cp" @click="close"></i>
    </div>
    <div v-if="blockMsg.overlaysMsg&&blockMsg.overlaysMsg.length < 3" style="padding:5px;text-align: center;font-size: 12px;">
        此红线暂未配置区域
    </div>
    <table class="list">
        <!--<tr>
            <td>青苗:</td>
            <td>{{blockMsg.qingMiao}}</td>
        </tr>
        <tr>
            <td>民房:</td>
            <td>{{blockMsg.mingFang}}</td>
        </tr>
        <tr>
            <td>厂房:</td>
            <td>{{blockMsg.changFang}}</td>
        </tr>
        <tr>
            <td>征拆总面积:</td>
            <td>{{blockMsg.areaTotal}} ㎡</td>
        </tr>
        <tr>
            <td>完成面积:</td>
            <td>{{blockMsg.areaDone}} ㎡</td>
        </tr>
        <tr>
            <td>补偿金额:</td>
            <td>{{blockMsg.planMoney}} 万元</td>
        </tr>
        <tr>
            <td>已支付:</td>
            <td>{{blockMsg.payedMoney}} 万元</td>
        </tr>
        <tr>
            <td>计划开始时间:</td>
            <td>{{blockMsg.bplanDate}}</td>
        </tr>
        <tr>
            <td>计划完成时间</td>
            <td>{{blockMsg.eplanDate}}</td>
        </tr>-->
        <!--<tr>-->
        <!--<td>实际开始时间</td>-->
        <!--<td></td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>实际完成时间</td>-->
        <!--<td></td>-->
        <!--</tr>-->
        <tr>
            <td>行政区域:</td>
            <td>{{blockMsg.areaName}}</td>
        </tr>
        <tr>
            <td>起始桩号:</td>
            <td>{{blockMsg.bpileNo}}</td>
        </tr>
        <tr>
            <td>终点桩号:</td>
            <td>{{blockMsg.epileNo}}</td>
        </tr>
        <tr>
            <td>面积(亩):</td>
            <td>{{blockMsg.area}}</td>
        </tr>
        <tr>
            <td>负责人:</td>
            <td>{{blockMsg.levyName}}</td>
        </tr>
        <tr>
            <td>标段:</td>
            <td>{{blockMsg.pactName}}</td>
        </tr>
    </table>
</div>
</template>
<script>
  export default {
    name: 'infoWindow',
    props: {
      blockMsg: {
        type: Object,
        default: function () {
          return {}
        }
      },
      show:false,
    },
    data () {
      return {
        kid: ''
      }
    },
    created(){
    },
    methods: {
      close () {
        // this.$el.style.display = 'none'
        this.show = false
      }
    }
  }
</script>
<style scoped lang="scss">
    .info {
        background: #fff;
        position: absolute;
    }

    .title {
        background: #449df2;
        color: #fff;
        padding: 5px;
        /*span{*/
            /*display: inline-block;*/
            /*border-left: 2px solid #00b4ff;*/
        /*}*/
    }

    .list {
        padding: 5px;
        font-size: 14px;
    }

    .list td {
        white-space: nowrap;
    }

    .list tr td:last-child {
        padding-left: 30px;
    }
</style>
