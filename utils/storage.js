import cfg from '../config/index'
const name = `JYHD-${cfg.type}-`

function getStorage(key) {
  try {
    let value = wx.getStorageSync(name + key)
    if (value) {
      return JSON.parse(value)
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
  }
}

function setStorage(key, value) {
  wx.setStorageSync(name + key, JSON.stringify(value))
}

function remStorage(key) {
  wx.removeStorageSync(name + key)
}

function clearStorage() {
  wx.clearStorageSync()
}

export {
  getStorage,
  setStorage,
  remStorage,
  clearStorage
}