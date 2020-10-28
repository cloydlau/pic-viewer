import PicViewer from './index.vue'

const install = function (Vue) {
  if (install.installed) {
    return
  }
  Vue.component(PicViewer.name, PicViewer)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// @ts-ignore
PicViewer.install = install

export default PicViewer

// todo: deprecated
export {
  PicViewer
}
