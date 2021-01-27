const app = getApp()

import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../../store/index'

Page({
  data: {
    bindPhone:false
  },
  onShow() {
    console.log('onliad')
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: {
        'authInfo': 'authInfo',
        'token':'token',
        'userInfo': 'userInfo',
        'showAuth':'showAuth'
      },
      actions: ['mpLogin', 'setAuth', 'setUserInfo','setShowAuth'],
    })
    this.storeBindings.updateStoreBindings()
    app.loginReadyCallback.then(() =>{
      const {userInfo,token}=this.data
      console.log(userInfo,token)
      if(!userInfo.userInfo || !token){
        this.setShowAuth(true)
      } else {
        wx.navigateTo({
          url: `/pages/home/H5/index`
        })
      }
    })
  }
})