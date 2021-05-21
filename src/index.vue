<template>
  <div
    :class="{
      'pic-viewer': true,
      'swiper-container': Pattern==='swiper'
    }"
    v-if="files.length"
    ref="picViewer"
  >
    <ul
      ref="viewer"
      :class="(Pattern==='swiper'?'swiper-wrapper':Pattern)||'normal-flow'"
    >
      <li
        v-for="(v,i) of files"
        :key="i"
        :class="Pattern==='swiper'&&'swiper-slide'"
      >
        <div
          :class="Viewerjs&&(v.endsWith('.png')?'reveal-on-hover': 'curl-on-hover')"
          @click="()=>{$emit('click',{index:i,src:v})}"
        >
          <slot :index="i" :src="v">
            <img
              :src="v"
              alt=""
              referrerpolicy="no-referrer"
            >
          </slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
import { name } from '../package.json'
import QRCode from 'qrcode'
import { validator, typeOf, awaitFor } from 'kayran'
const { base64, url } = validator
import { getFinalProp } from './utils'
import globalProps from './config'
import { isPlainObject } from 'lodash-es'
import 'swiper/swiper-bundle.min.css'
import Swiper from 'swiper/swiper-bundle.min.js'

const prefix = `[${name}] `

export default {
  name: 'PicViewer',
  props: {
    value: {
      validator: value => ['string', 'array', 'null'].includes(typeOf(value)),
    },
    objectKey: String,
    qrcode: {
      validator: value => ['', 'auto'].includes(value) || ['boolean'].includes(typeOf(value)),
    },
    pattern: String,
    qrcodeProps: Object,
    swiperProps: Object,
    viewerjs: {
      validator: value => '' === value || ['boolean'].includes(typeOf(value)),
    },
    viewerjsProps: Object,
  },
  watch: {
    Value: {
      immediate: true,
      async handler (n, o) {
        if (n) {
          // 支持 json-string
          if (typeof n === 'string' && n.startsWith('[') && n.endsWith(']')) {
            try {
              n = JSON.parse(n)
            } catch (e) {
              console.error(e)
            }
          }
          if (n instanceof Array) {
            const files = []
            for (let v of this.ObjectKey ? Array.from(n, v => v[this.ObjectKey]) : n) {
              if (v) {
                if (typeof v === 'string') {
                  let a = await this.getImgSrc(v)
                  files.push(a)
                } else if (!this.ObjectKey && isPlainObject(v)) {
                  console.error(prefix + 'value 含对象类型元素，但未指定 objectKey')
                } else {
                  console.error(prefix + 'objectKey 的值仅能是 string 类型')
                }
              }
            }
            this.files = files
            /*this.files = this.objectKey ?
              Array.from(n, v => v[this.objectKey]).filter(this.getImgSrc) :
              n.filter(this.getImgSrc)*/
          } else {
            this.files = [await this.getImgSrc(n)]
          }
        } else {
          this.files = []
        }
      }
    },
    files (n) {
      if (n.length) {
        this.$nextTick(() => {
          if (this.Pattern === 'swiper' && !this.swiper) {
            this.swiper = new Swiper(this.$refs.picViewer, this.SwiperProps)
          }

          if (this.Viewerjs) {
            if (this.viewer) {
              this.viewer.update()
            } else {
              this.viewer = new Viewer(this.$refs.viewer, this.ViewerjsProps)
            }
          }
        })
      }
    }
  },
  data () {
    return {
      files: [],
      viewer: null,
      swiper: null,
    }
  },
  computed: {
    Viewerjs () {
      return getFinalProp(this.viewerjs, globalProps.viewerjs, true)
    },
    ViewerjsProps () {
      return getFinalProp(this.viewerjsProps, globalProps.viewerjsProps, {
        zIndex: 5000,
      })
    },
    SwiperProps () {
      return getFinalProp(this.swiperProps, globalProps.swiperProps, {
        //wrapperClass: 'swiper',
        //slideClass: 'item',
        observer: true,
      })
    },
    Pattern () {
      return getFinalProp(
        this.pattern,
        globalProps.pattern,
        (this.$parent || this.$root)?.$el?.className === 'el-table__body' ? 'table-cell' : undefined
      )
    },
    Value () {
      return getFinalProp(this.value, globalProps.value)
    },
    ObjectKey () {
      return getFinalProp(this.objectKey, globalProps.objectKey)
    },
    Qrcode () {
      return getFinalProp(this.qrcode, globalProps.qrcode, false)
    },
    QrcodeProps () {
      return getFinalProp(this.qrcodeProps, globalProps.qrcodeProps, {
        margin: 0,
        scale: 400,
        errorCorrectionLevel: 'L',
        width: 148,
        height: 148,
      })
    },
  },
  methods: {
    async getImgSrc (str) {
      if (this.Qrcode === 'auto') {
        // 字符串
        if (url(str) && base64(str, {
          mediaType: 'image/',
          scheme: true
        })) {
          const [res, err] = await awaitFor(QRCode.toDataURL(str, this.QrcodeProps))
          return res
        }
        // base64或url
        else {
          return str
        }
      } else if (this.Qrcode) {
        const [res, err] = await awaitFor(QRCode.toDataURL(str, this.QrcodeProps))
        return res
      } else {
        return str
      }
    },
    preview (i = 0) {
      if (this.viewer) {
        if (this.Value) {
          if (this.Value instanceof Array) {
            if (this.Value.length === 0) {
              console.error(prefix + 'value 为空')
            } else if (i < 0 || i > this.Value.length - 1) {
              console.error(prefix + 'preview 参数越界')
            } else {
              this.viewer.view(i)
            }
          } else {
            this.viewer.show()
          }
        }
      } else {
        console.error(prefix + 'viewerjs 已被禁用')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
/*@keyframes bob {
  0% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(-8px);
  }
}

@keyframes bob-float {
  100% {
    transform: translateY(-8px);
  }
}*/

@media (any-hover: hover) {
  .curl-on-hover {
    vertical-align: middle;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    cursor: pointer;

    &:before {
      content: '';
      pointer-events: none;
      position: absolute;
      height: 0;
      width: 0;
      bottom: 0;
      right: 0;
      background: white;
      //IE9
      background: linear-gradient(315deg, white 45%, #aaa 50%, #ccc 56%, white 80%);
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.4);
      transition-duration: 0.3s;
      transition-property: width, height;
    }

    &:hover:before, &:focus:before, &:active:before {
      width: 25px;
      height: 25px;
    }
  }

  .reveal-on-hover {
    display: inline-block;
    vertical-align: middle;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      z-index: -1;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-color: rgba(32, 152, 209, .1);
      border-style: solid;
      border-width: 0;
      transition-property: border-width;
      transition-duration: 0.1s;
      transition-timing-function: ease-out;
    }

    &:hover:before, &:focus:before, &:active:before {
      transform: translateY(0);
      border-width: 4px;
    }
  }
}

.pic-viewer {
  img {
    vertical-align: middle; // fix: 图片下方空隙
    object-fit: cover; // 保持图片比例
    max-width: 100%;
    max-height: 100%;
  }

  & > ul {
    padding: 0;
    margin: 0 auto;

    & > li {
      list-style: none;
    }
  }

  & > ul.swiper-wrapper {
    & > .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  & > ul.waterfall {
    display: inline-block;
    position: relative;
    column-width: 148px;
    column-gap: 1rem;
    width: 100%; // 图片大小完全一致时显示异常

    & > li {
      width: 100%;
      break-inside: avoid;
      // margin-bottom: 15px; // 会导致底部错位

      & > div {
        margin-bottom: 15px;

        & > img {
          width: 100%;
          height: 100%;
          //border-radius: 5px;
        }
      }

      /*&:hover {
        animation-name: bob-float, bob;
        animation-duration: .3s, 1.5s;
        animation-delay: 0s, .3s;
        animation-timing-function: ease-out, ease-in-out;
        animation-iteration-count: 1, infinite;
        animation-fill-mode: forwards;
        animation-direction: normal, alternate;
      }*/
    }
  }

  & > ul.normal-flow {
    display: inline-block;
    margin: 0;

    & > li {
      list-style: none;
      display: inline-block;
      margin: 0 15px 15px 0;

      & > div > img {
        height: 148px; // 与 el-upload 组件保持一致
        vertical-align: middle;
        //border-radius: 5px;
      }
    }
  }

  & > ul.table-cell {
    display: inline-block;
    height: 50px;
    margin: 0;

    @media (any-hover: hover) {
      .curl-on-hover {
        &:hover:before, &:focus:before, &:active:before {
          width: 10px;
          height: 10px;
        }
      }
    }

    & > li {
      list-style: none;
      display: inline-block;
      margin: 0 10px 10px 0;

      & > div > img {
        height: 50px;
        vertical-align: bottom; // 换行时被遮挡
        //border-radius: 5px;
      }
    }
  }
}
</style>

<!--<style lang="scss">
.viewer-button {
  background-color: rgba(0, 0, 0, 1);
  height: 100px;
  right: -50px;
  top: -50px;
  width: 100px;
}
</style>-->
