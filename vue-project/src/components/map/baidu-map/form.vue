<template>
    <el-popover
            ref="popover"
            placement="top"
            width="400"
            trigger="click">
        <div class="tempalte">

            <div class="item" v-for="item in domains">
                <el-input v-model="item.lng" placeholder="经度,例 116.396"></el-input>
                <el-input v-model="item.lat" placeholder="纬度,例 39.909"></el-input>
                <el-button @click.prevent="removeDomain(item)">删除</el-button>
            </div>

            <div style="text-align: center;">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button type="primary" @click="addDomain">新增</el-button>
                <el-button type="primary" @click="resetForm">清空</el-button>
            </div>
            <div class="tip" >
                {{tip}}
            </div>
        </div>

        <div class="btn" slot="reference">新增</div>
        <!--<div  slot="reference">-->
        <!--<slot></slot>-->
        <!--</div>-->
    </el-popover>
</template>
<script>
  export default {
    props: {
      customerPoint: Array
    },
    data () {
      return {
        domains: [
          { lng: null, lat: null },
          { lng: null, lat: null },
          { lng: null, lat: null },
          { lng: null, lat: null }
        ],
        tip:null
      }
    },
    watch: {
      customerPoint (val) {
        let a = JSON.parse(JSON.stringify(val))
        if(a.length){
          this.domains = a
        }
      }
    },
    created () {
      // console.log(this, '11111111')
    },
    methods: {
      submitForm (formName) {
       let isWrong =  this.domains.some((item,index)=>{
          if(item.lat&&item.lng){
            if(this.isNumber(item.lat)&&this.isNumber(item.lng)){
              return false
            }
            this.tip = `第${index + 1}项,需要填入数数值`
            return true
          }
          this.tip = '每一项都是必填项!'
          return true
        })
        if(!isWrong){
          this.$emit('addCustomer', this.domains)
        }
      },
      isNumber(val){
            return    typeof (val * 1) === 'number' &&  !isNaN(val)
      },
      resetForm (formName) {
        this.domains.forEach((item)=>{
          item.lng = null
          item.lat = null
        })
      },
      removeDomain (item) {
        if(this.domains.length === 1){
          item.lat = null
          item.lng = null
          return
        }
        var index = this.domains.indexOf(item)
        if (index !== -1) {
          this.domains.splice(index, 1)
        }
      },
      addDomain () {
        this.domains.push({
          value: '',
          key: Date.now()
        })
      }
    }
  }
</script>
<style scoped>
    .tempalte {
        height: 250px;
        overflow: auto;
    }

    .item {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
    }

    .btn {
        border-right: 1px solid #d2d2d2;
        float: left;
        width: 64px;
        height: 45px;
        line-height: 45px;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        background: #fff;
    }

    .tempalte >>> .el-input {
        width: 140px;
        margin-bottom: 15px;
    }
    .tip{
        text-align: center;
        color: #ff0000;
    }
</style>
