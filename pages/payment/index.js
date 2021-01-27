const app = getApp()
import api from '../../api/index'
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import {
  getStorage,
  remStorage
} from '../../utils/storage'
Page({
  data: {
    orderAPI: {},
    checkPay: false,
    timer:null,
    num:0
  },
  onLoad() {

    app.loginReadyCallback.then(() => {
      //创建订单
      this.createOrder()

    })
  },
  //创建订单
  createOrder() {
    wx.showLoading()
    const params = getStorage('payment')
    api('createOrder', params).then(res => {
      wx.hideLoading()
      this.setData({
        orderAPI: res
      }, () => {
        this.payment()
      })
    })
  },
  //check
  checkOrder() {
    const {
      orderAPI
    } = this.data
    api('checkOrder', {
      orderNo: orderAPI.orderNo
    }).then(res => {
      console.log(res,'res')
      console.log(this.data.num,'num')
      //测试环境直接通过
      if(res === 2){
        clearInterval(this.data.timer)
        this.setData({
          timer:null
        },()=>{
          Notify({
            type: 'success',
            message: '支付成功',
            duration: 1000,
            onClose() {
              remStorage('payment')
              wx.redirectTo({
                url: `/pages/home/H5/index?orderNo=${orderAPI.orderNo}`, // nopay
              })
            }
          })
        })
      }else{
        if(this.data.num === 5){
          Notify({
            type: 'danger',
            message: '服务器出小差，未收款成功，请您收到退款后重新支付',
            duration: 1000,
            onClose() {
              remStorage('payment')
              wx.redirectTo({
                url: `/pages/home/H5/index?orderNo=${orderAPI.orderNo}`, // nopay
              })
            }
          })
        }
      }
    }).catch(err => {
      remStorage('payment')
      wx.redirectTo({
        url: `/pages/home/H5/index?orderNo=${orderAPI.orderNo}`, // nopay
      })
    })
  },
  //发起支付
  payment() {
    const {
      orderAPI
    } = this.data
    wx.requestPayment({
      nonceStr: orderAPI.nonceStr,
      package: `prepay_id=${orderAPI.package}`,
      paySign: orderAPI.sign,
      timeStamp: orderAPI.timeStamp,
      signType: 'MD5',
      success: async () => {
        this.setIntervalFn()
      },
      fail: (err) => {
        console.log(err)
        Toast.fail('支付失败');
        remStorage('payment')
        wx.redirectTo({
          url: `/pages/home/H5/index?orderNo=${orderAPI.orderNo}`, // nopay
        })
      }
    })
  },
  setIntervalFn(){
    const that=this
    this.data.timer=setInterval(()=>{
      that.checkOrder()
      that.data.num++
    },1000)
  },
  async countDown() {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '正在跳转3s'
    });
    let second = 3;
    while (second) {
      toast.setData({
        message: `正在跳转${second}s`,
      });
      second--;
      await (new Promise((resolve) => setTimeout(resolve, 1000)))
    }
    toast.clear()
  },
})