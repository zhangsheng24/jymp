// 配置编译环境和线上环境之间的切换
const env = __wxConfig.envVersion

let config = {
  host: "",
  port: "",
  baseUrl: "",
  type: "develop",
  redirect: '',
  infoUrl:''
}

config.type = env

if (config.type === 'develop') {  // 开发板
  config.baseUrl = 'http://192.168.148.174:8080/'
  config.infoUrl = 'http://192.168.148.174:8083/'//用于创建订单
  config.redirect='https://jyhdmeetingh5.jingyuhuodong.com/dev/client/'
  // config.host = 'https://periphery.jyhd.sjyt.net'
} else if (config.type === 'trial') { // 体验版
  config.redirect='https://jyhdmeetingh5test.jingyuhuodong.com/test/client/'
  config.baseUrl = 'http://192.168.148.175:8080/'
  config.infoUrl = 'http://192.168.148.175:8083/'//用于创建订单
} else if (config.type === 'release') { // 正式版
  config.host = 'https://activity.jingyuhuodong.com/api'
}
export default config