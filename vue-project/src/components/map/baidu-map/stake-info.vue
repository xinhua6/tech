<template>
    <div class="info" v-show="show">
        <div class="title">
            <span>详情</span>
            <i class="el-icon-close c-fr c-cp" @click="close"></i>
        </div>
        <div class="name">起止桩号:{{blockMsg.bpileNo + ' - '+ blockMsg.epileNo}}</div>
        <table class="list">
            <tr style="text-align: center">
                <th style="width: 30px">类型</th>
                <th style="width: 100px">进度</th>
                <th >数量（亩）</th>
            </tr>
            <tr>
                <td>确权</td>
                <td>
                    <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="blockMsg.ratio1 || 0"
                            color="#7CC8FF">
                    </el-progress>
                </td>
                <td>{{blockMsg.allQty0}}</td>
            </tr>
            <tr>
                <td>拆迁</td>
                <td>
                    <el-progress
                        :text-inside="true"
                        :stroke-width="16"
                        :percentage="blockMsg.ratio0 || 0"
                        color="#7CC8FF">
                    </el-progress>
                </td>
                <td>{{blockMsg.allQty1}}</td>
            </tr>
            <tr>
                <td>交地</td>
                <td>
                    <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="blockMsg.ratio2 || 0"
                            color="#7CC8FF">
                    </el-progress>
                </td>
                <td>{{blockMsg.allQty2}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
  export default {
    name: 'stakeInfo',
    props: {
      blockMsg: {
        type: Object,
        default: function () {
          return {}
        }
      },
      show: false,
    },
    data () {
      return {
        kid: ''
      }
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
        width: 220px;
        padding-bottom:5px;
        position: absolute;
    }
    .name{
        font-size: 14px;
        color:#449df2 ;
        text-align: center;
        padding: 5px 0 0 0px;

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
        width: 100%;
        padding: 5px;
        font-size: 14px;
    }
    .list th {
        font-weight: normal;
    }
    .list tr {
        text-align: center;

    }
    .list td {
        white-space: nowrap;
        text-align: center;
        padding: 8px 0;
        border-bottom: 1px solid #ececec;
    }
    .list td:first-child {
     padding-right: 5px;
    }


</style>
<style scoped>
    .list >>> .el-progress-bar__outer{
        border-radius: 0;
    }
    .list >>> .el-progress-bar__inner{
        border-radius: 0;
    }
</style>

