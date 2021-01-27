import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import {store} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [storeBindingsBehavior],
  properties: {
    
  },
  storeBindings: {
    store,
    fields: {
      'url': 'url',
    }
  },
  attached() {
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
    
  }
 
})
