import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {store} from '../../../store/index'
import {setStorage} from '../../../utils/storage'
import cfg from '../../../config/index'
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [storeBindingsBehavior],
  properties: {
    orderNo:String
  },
  storeBindings: {
    store,
    fields: {
      'url': 'url',
    }
  },
  attached() {
    console.log(this.data.url)
    this.updateStoreBindings()
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      if(this.data.orderNo){
        this.setData({
          url:`${cfg.redirect}my/order/orderDetails?orderNo=${this.data.orderNo}`
        })
      } 
    },
    getMessage(e){
      console.log(e)
      const data=e.detail.data
      if(data[0].updateToken){
        console.log(1)
        this.storeBindings = createStoreBindings(this, {
          store,
          actions: ['setToken','setUrl'],
        })
        this.setToken(data[0].updateToken)
        this.setUrl()
        this.storeBindings.updateStoreBindings()
      }
      if(data[0].params){
        setStorage('payment',data[0].params)
        wx.navigateTo({
          url: '/pages/payment/index'
        });
          
      }
    }
  }
 
})
