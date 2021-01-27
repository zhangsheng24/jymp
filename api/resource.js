import cfg from '../config/index'
const baseURL = cfg.baseUrl
const infoURL = cfg.infoUrl


export default {
  mpAuth:{
    url:baseURL + 'user/auth/wx',
    method:'post'
  },
  mpLogin:{
    url:baseURL + 'user/login/mp',
    method:'post'
  },
  getUserInfo:{
    method:'get',
    url:baseURL + 'user/getUserInfo'
  },
  createOrder:{
    method: 'post',
    url: infoURL + "featureOrder/createFeaturesBatchOrder"
  },
  checkOrder:{
    method: 'post',
    url: infoURL + "featureOrder/checkOrderPayStatus"
  }
}