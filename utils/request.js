class Axios {
  constructor(defaultConfig) {
    this.instance = null // 类的实例
    this.config = defaultConfig
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  create(instanceConfig) {
    const { config } = this
    // 创建实例的时候添加基本配置
    this.config = {
      ...config,
      ...instanceConfig
    }
    return this
  }

  // 单例
  static getInstance() {
    if (!this.instance) {
      this.instance = new Axios()
    }
    return this.instance
  }
  request(options) {
    const { config, interceptors } = this
    // 实例请求的时候添加基本配置
    const requsetOptions = {
      ...config,
      ...options
    }

    const promiseArr = [] // promise存储队列

    // 请求拦截器
    promiseArr.push({
      fulfilled: interceptors.request.fulfilled,
      rejected: interceptors.request.rejected
    })

    // 请求
    promiseArr.push({
      fulfilled: dispatchRequest,
      rejected: null
    })

    // 回调拦截器
    promiseArr.push({
      fulfilled: interceptors.response.fulfilled,
      rejected: interceptors.response.rejected
    })

    let p = Promise.resolve(requsetOptions)
    promiseArr.forEach(ele => {
      p = p.then(ele['fulfilled'], ele['rejected'])
    })
    return p
  }
}

class InterceptorManager {
  constructor() {
    this.fulfilled = null
    this.rejected = null
  }

  use(fulfilled, rejected) {
    this.fulfilled = fulfilled
    this.rejected = rejected
  }
}

const axios = Axios.getInstance()

const dispatchRequest = function (config) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

export default axios