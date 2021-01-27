import { observable, action } from 'mobx-miniprogram'
import { getStorage, setStorage } from '../utils/storage'
import { USER_TOKEN, ACTIVE_CODE, USER_INFO,PHONE } from '../config/const'
import api from '../api/index'
import cfg from '../config/index'

export const store = observable({
  token: getStorage(USER_TOKEN) || '',
  authInfo:{},
  userInfo:getStorage(USER_INFO) || {},
  showAuth:false,
  url:'',
  // actions
  setToken: action(function (data) {
    this.token = data
    setStorage(USER_TOKEN,data)
  }),
  setShowAuth:action(function(data){
    this.showAuth=data
  }),
  setUrl:action(function(data){
    this.url=`${cfg.redirect}?jwtToken=${this.token}&avatar=${getStorage('avatar')}&name=${getStorage('name')}&phone=${getStorage('phone')}&userId=${getStorage('userId')}`
    this.url = encodeURI(this.url)
  }),
  setUserInfo: action(function (data) {
    this.userInfo = data
    setStorage(USER_INFO,data)
  }),
  setAuth:action(function(data){
    this.authInfo=data
  }),
  mpLogin:action(function(data){
    const params={
      authCode:data.authCode,
      encryptedData:data.encryptedData,
      iv:data.iv,
      phoneEncryptedData:data.phoneEncryptedData,
      phoneIv:data.phoneIv
    }
    return new Promise((resolve,reject)=>{
      api('mpLogin',params).then(res=>{
        if(res.token){
          this.token=res.token
          this.url=`${cfg.redirect}?jwtToken=${res.token}&avatar=${res.avatar}&name=${res.name}&phone=${res.phone}&userId=${res.userId}`
          setStorage(USER_TOKEN,res.token)
          setStorage('avatar',res.avatar)
          setStorage('name',res.name)
          setStorage('phone',res.phone)
          setStorage('userId',res.userId)
        }
          resolve(res)
      }).catch(err=>{
        reject(err)
      })
    })
    
  })
})