import {
  USER_TOKEN
} from './config/const'
import {
  getStorage,
  setStorage,
  remStorage
} from '/utils/storage'
import {
  promisifyAll
} from 'miniprogram-api-promise'
import api from './api/index'
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  store
} from '/store/index'
let jwx = {}
promisifyAll(wx, jwx)
wx = jwx

App({
  onLaunch: function (optiones) {
    this.storeBindings = createStoreBindings(this, {
      store,
      actions: ['setAuth','mpLogin','setToken','setUserInfo','setUrl'],
    })
    this.getUserInfo()
    this.loginReadyCallback = new Promise((resolve, reject) => {
      // 检测登录是否过期
      wx.checkSession().then(() => {
        // 未过期
        if (getStorage(USER_TOKEN)) {
          this.setUrl()
          resolve()
        } else {
          this.mpAuth(resolve, reject)
        }
      }).catch(err => {
        // 失效
        console.log(err)
        this.mpAuth(resolve, reject)
      })
    })
  },
  async mpAuth(resolve, reject) {
    wx.login().then(res => {
      api('mpAuth', {
        code: res.code
      }).then(res => {
        this.setAuth(res)
        resolve()
      })
    })
  },
  //获取用户信息
  getUserInfo() {
    wx.getSetting().then(res=>{
      if (res.authSetting['scope.userInfo']) {
        //调取登录接口
        wx.getUserInfo().then(res=>{
          this.setUserInfo(res)
        }).catch(err=>{
          console.log(err)
        })
      }else{
        // this.setToken('')
        // remStorage(USER_TOKEN)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
})