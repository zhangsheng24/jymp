// components/auth/index.js
// const computedBehavior = require('miniprogram-computed')
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import {store} from '../../store/index'
Component({
  behaviors: [storeBindingsBehavior],
  /**
   * 组件的属性列表
   */
  properties: {

  },
  storeBindings: {
    store,
    fields: {
      'userInfo': 'userInfo',
      'authInfo':'authInfo'
    },
    actions: ['setUserInfo','setAuth','setShowAuth','mpLogin','setUrl'],
  },
  attached() {
    this.updateStoreBindings()
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(e) {
      console.log(e.detail)
      this.setUserInfo(e.detail)
      if (e.detail.userInfo) {
        this.updateStoreBindings()
        console.log(this.data.userInfo)
        //弹出框提示获取用户手机号
        if(!this.data.authInfo.authPhone){
          this.setData({
            show: true
          })
        } else {
          const data = {
            authCode: this.data.authInfo.authCode,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          }
          this.mpLogin(data).then((res) => {
            this.setShowAuth(false)
            this.setData({
              show: false
            })
            this.setAuth({
              authCode: this.data.authInfo.authCode,
              authPhone: true
            })
            this.setUrl()
            wx.navigateTo({
              url: `/pages/home/H5/index`
            })
          })
        }
      }
    },
    getPhoneNumber(e) {
      const {
        iv,
        encryptedData
      } = e.detail
      if (iv && encryptedData) {
        const data = {
          authCode: this.data.authInfo.authCode,
          phoneEncryptedData: encryptedData,
          phoneIv: iv,
          encryptedData: this.data.userInfo.encryptedData,
          iv: this.data.userInfo.iv,
        }
        this.mpLogin(data).then((res) => {
          this.setShowAuth(false)
          this.setData({
            show: false
          })
          this.setAuth({
            authCode: this.data.authInfo.authCode,
            authPhone: true
          })
          wx.navigateTo({
            url: `/pages/home/H5/index`
          })
        })
      }
    },
  }
})