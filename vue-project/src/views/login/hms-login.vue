<template>
    <div class="login">
      <div class="main">
        <div class="center tvc">
          <div class="login-main">
            <!--公司名称 logo-->
            <div class="logo c-tvc">
              <img  src="./img/logo.png">
              <!--{{sysName}}-->
         </div>
            <!--表单-->
            <div class="form">
              <!--账号登录-->
              <div class="content">
                <div class="col input-chang">
                  <img src="~./img/person.png">
                  <input placeholder="账户名" v-model="loginData.username"/>
                </div>
                <div class="col input-chang" v-if="!visible">
                  <img src="~./img/password.png">
                  <input  placeholder="密码" type="password" v-model="loginData.password" @keyup.enter="login"/>
                  <img src="./img/eyeclose.svg" @click.prevent="visible = true">
                </div>
                <div class="col input-chang" v-if="visible">
                  <img src="~./img/password.png">
                  <input  placeholder="密码" v-model="loginData.password" @keyup.enter="login"/>
                  <img src="./img/eyeshow.svg" @click.prevent="visible = false">
                </div>

                <div class="col" v-if="showYzm">
                  <div class="tvc input-chang">
                    <img src="~./img/yzm.png">
                    <input  placeholder="验证码" style="width: 110px" v-model="loginData.yzm" @keyup.enter="login"/>
                  </div>
                  <div style="flex: 1;height: 40px;" class="tvc">
                    <div v-loading="imgLoading" class="yzm">
                      <img :src="yzmUrl" @click="yzmClick"/>
                    </div>
                    <div class="yzm-refresh">
                      <span  @click="yzmClick">刷新</span>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <button v-loading="loading" class="button" @click="login">登录</button>
                </div>
                <div class="col">
                  <div class="save" @click="savePass = !savePass">
                    <div :class="{saved: savePass}" class="squre"></div>
                    <!--<span>记住密码</span>   -->
                    <span>记住账号</span>
                  </div>
                </div>

                <div class="col">
                  <div class="warn-msg"> {{warnMsg}}</div>
                </div>
              </div>
              <!--ukey登录-->
            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
import { SYS_ZH_NAME, SYS_NAME } from 'src/config'
import md5 from 'js-md5'

const userKey = `${SYS_NAME}_USERNAME`
const passKey = `${SYS_NAME}_UUID`
export default {
  data () {
    const showYzm = false
    return {
      visible: false,
      showYzm: showYzm,
      sysName: SYS_ZH_NAME,
      imgLoading: true,
      loading: false,
      yzmUrl: null,
      warnMsg: null,
      loginData: {
        username: null,
        password: null,
        yzm: showYzm ? null : 'hP6JU',
        // 后台需要
        yzmKey: null
      },
      savePass: false
    }
  },
  computed: {},
  watch: {
    loginData: {
      deep: true,
      handler () {
        if (this.validateInput()) {
          this.warnMsg = null
        }
      }
    }
  },
  created () {
    this.yzmClick()
    this.getSavePass()
  },
  methods: {
    yzmClick () {
      this.imgLoading = true
      this.$axios({
        _ignore: true,
        url: '',
        params: { time: new Date().getTime() }
      }).then(response => {
        let data = response.data
        this.yzmUrl = data.yzm
        this.yzmKey = data.key
      }).finally(_ => this.imgLoading = false)
    },
    login () {
      if (!this.validateInput(true)) {
        this.yzmClick()
        return
      }
      let password = this.loginData.password
      password = password.length === 32 ? password : md5(password)
      const dataForm = {
        ...this.loginData,
        password,
        key: this.yzmKey
      }
      this.loading = true
      this.$store.dispatch('login', dataForm)
        .then((r) => {
          if (r.success) {
            this.$router.push('/')
            this.savePassword(password)
          } else {
            this.warnMsg = r.msg
          }
        })
        .catch((e) => {
          this.warnMsg = '网络异常'
        })
        .finally(a => this.loading = false)
    },
    validateInput (showTip) {
      const { username, password, yzm } = this.loginData
      let msg = null
      let go = true
      if (!username) {
        msg = '*用户名为空，请输入用户名…'
        go = false
      }
      if (!password && go) {
        msg = '*密码为空，请输入密码…'
        go = false
      }
      if (!yzm && go) {
        msg = '*请输入验证码…'
        go = false
      }
      if (showTip) {
        this.warnMsg = msg
      }
      return go
    },
    savePassword (password) {
      if (this.savePass) {
        const { username } = this.loginData
        localStorage.setItem(userKey, username)
        // localStorage.setItem(passKey, password)
      } else {
        localStorage.removeItem(userKey)
        localStorage.removeItem(passKey)
      }
    },
    getSavePass () {
      const data = this.loginData
      if (localStorage.getItem(userKey)) {
        data.username = localStorage.getItem(userKey)
        data.password = localStorage.getItem(passKey)
        this.savePass = true
      }
      if (process.env.NODE_ENV === 'development') {
        // data.username = '管理员'
        // data.password = '123456'
        data.yzm = 'hP6JU'
        this.savePass = true
      }
    }
  }

}
</script>

<style scoped lang="scss">
  @keyframes resetBg {
    to {
      color: #000;
      background: transparent;
    }
  }
  .tvc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .main {
    flex: 1;
    background: url("~./img/hms-bg.png") no-repeat 100%;
    padding: 5%;
  }
  .center{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("~./img/hms-login-bg.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 5px;
    box-shadow:0 0 20px rgba(0, 0, 0, 0.5);
  }
  .login-main{
    position: absolute;
    right: 10%;
    background: #fff;
    padding: 30px;
  }
  .logo{
    width: 100%;
    font-size: 26px;
    color: #2E3B46;
    font-weight: 700;
  }
  .form {
    width: 376px;
    background-color: #fff;
    margin: 10px auto;
    border-radius: 6px;
  }
  .content {
    padding: 20px 30px 20px;
  }

  .col {
    margin-top: 10px;
    display: flex;
    justify-content: left;
    align-items: center;
    > span {
      display: inline-block;
      padding: 0 5px;
      width: 66px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1)

    }
    input {
      flex: 1;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border: 1px solid rgba(160, 185, 220, 1);
      border-radius: 3px;
      outline: none;
      display: inline-block;
      width: auto;
      animation: resetBg .1s forwards;
    }
    .yzm {
      width: 130px;
      cursor: pointer;
      height: 100%;
      border: 1px solid #E8EEF0;
      border-radius: 3px;
      padding: 7px;
    }

    .yzm-refresh{
      width: 50px;
      height: 40px;
      cursor: pointer;
      border: 1px solid #E8EEF0;
      border-left: none;
      border-radius: 3px;
      color: #2973EE;
      line-height: 38px;
    }
    .save {
      @extend .tvc;
      cursor: pointer;
    }
    // 记住密码
    .squre {
      width: 14px;
      height: 14px;
      margin: 0 5px 0 0;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(107, 153, 189, 1);
      &.saved {
        border:0;
        background: url("~./img/saved.png");
      }
    }

    .warn-msg {
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      width: 100%;
      color: rgba(255, 0, 0, 1);
    }
  }

  .button {
    display: inline-block;
    width: 100%;
    height: 50px;
    border: 0;
    color: #fff;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    background: linear-gradient(0deg, $base-color, $base-color);
    border-radius: 3px;
  }

  .footer {
    background: rgba(35, 56, 77, 1);
    color: #fff;
  }
  // input-chang
  .input-chang{
    border: 1px solid #E8EEF0;
    border-radius: 3px;
    padding-left: 5px;
    input {
      border: none;
    }
  }
</style>
