import axios from '../utils/request'
import resource from './resource'
import cfg from '../config/index'
import { USER_TOKEN } from '../config/const'
import statusCode from '../config/status-code'
import { getStorage, remStorage } from '../utils/storage'

//请求拦截处理
axios.interceptors.request.use(
  config => {
    const token = getStorage(USER_TOKEN)
    if (token) {
      config.header[USER_TOKEN] = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
//请求响应处理
axios.interceptors.response.use(
  res => {
    if (res.statusCode === 200 && res.data.code === 1) {
      return res.data.data
    } else {
      if (statusCode[res.data.code]) {
        console.log(statusCode[res.data.code])
        wx.showToast({
          title: statusCode[res.data.code],
          icon: 'none',
          duration: 1500
        })
        if (res.data.code === 30006 || res.data.code === 30007) {
          console.log('token失效')
          remStorage(USER_TOKEN)
          // wx.reLaunch({
          //   url: '/pages/login/index'
          // })
        }
      } else { }
      return Promise.reject(res.data)
    }
  },
  err => {
    return Promise.reject(err)
  }
)

const instance = (config = {}) => {
  return axios.create({
    ...config
  })
}

export default function (name, data = {}, other = {}) {
  try {
    const arg = {
      method: 'GET',
      url: '',
      data,
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      ...other
    }
    if (name.slice(0, 4) === 'http') {
      arg.url = name
    } else {
      const paths = name.split('.')
      let apiArgs = resource
      paths.forEach(item => {
        if (typeof apiArgs === 'undefined') {
          throw Error('无对应接口')
        }
        apiArgs = apiArgs[item]
      })
      // arg.url = `${cfg.host}${cfg.port}${cfg.baseUrl}${apiArgs.url}`
      arg.url = apiArgs.url
      arg.method = apiArgs.method.toLocaleUpperCase()
    }
    if (arg.params && arg.method === 'POST') {
      const paramsArray = []
      Object.keys(arg.params).forEach(key => paramsArray.push(`${key}=${arg.params[key]}`))
      if (paramsArray.length > 0) {
        if (arg.url.indexOf('?') === -1) {
          arg.url += `?${paramsArray.join('&')}`
        } else {
          arg.url += `&${paramsArray.join('&')}`
        }
      }
      delete arg.params
      delete arg.data
    }
    console.log(arg)
    return instance().request(arg)
  } catch (error) {
    throw Error('请求基础数据缺少', name, error)
  }
}