<template>
  <div class="pic-viewer">
    <ul ref="viewer" :class="{
        'normal-flow': !waterfall || tableCell,
        'waterfall': !tableCell && waterfall
      }">
      <li v-for="(v,i) of files" :key="i">
        <div :class="v.endsWith('.png')?'reveal-on-hover': 'curl-on-hover'">
          <img :src="v" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'

export default {
  name: 'PicViewer',
  props: {
    value: {
      validator: value => ['String', 'Array', 'Null'].includes(({}).toString.call(value).slice(8, -1)),
    },
    objectKey: String,
    tableCell: Boolean, //todo: deprecated
    waterfall: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          if (newVal instanceof Array) {
            this.files = this.objectKey ?
              Array.from(newVal, v => v[this.objectKey]).filter(v => v) :
              newVal.filter(v => v)
          } else {
            this.files = [newVal]
          }
          this.$nextTick(() => {
            if (this.viewer) {
              this.viewer.update()
            } else {
              this.viewer = new Viewer(this.$refs.viewer, {
                zIndex: 5000
              })
            }
          })
        } else {
          this.files = []
        }
      }
    }
  },
  data () {
    return {
      files: [],
      viewer: null
    }
  },
  methods: {
    preview (i = 0) {
      if (this.viewer) {
        if (this.value) {
          if (this.value instanceof Array) {
            if (this.value.length === 0) {
              console.error('[pic-viewer] value为空')
            } else if (i < 0 || i > this.value.length - 1) {
              console.error('[pic-viewer] preview参数越界')
            } else {
              this.viewer.view(i)
            }
          } else {
            this.viewer.show()
          }
        }
      }
    }
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

.curl-on-hover {
  vertical-align: middle;
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;

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

.normal-flow .curl-on-hover {
  &:hover:before, &:focus:before, &:active:before {
    width: 10px;
    height: 10px;
  }
}

.reveal-on-hover {
  display: inline-block;
  vertical-align: middle;
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  overflow: hidden;

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

.pic-viewer {
  & > ul.waterfall {
    padding: 15px;
    margin: 0 auto;
    position: relative;
    column-width: 200px;
    column-gap: 1rem;

    & > li {
      width: 100%;
      list-style: none;
      break-inside: avoid;
      // margin-bottom: 15px; // 会导致底部错位
      cursor: pointer;

      & > div {
        margin-bottom: 15px;

        & > img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
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
    padding: 0;
    height: 50px;
    margin: 0;

    & > li {
      list-style: none;
      display: inline-block;
      cursor: pointer;
      margin: 0 10px 10px 0;

      & > div > img {
        height: 50px;
        vertical-align: middle;
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
